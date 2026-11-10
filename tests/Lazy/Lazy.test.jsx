import { act, render, screen } from '@testing-library/react';

import Lazy from '../../components/Lazy/Lazy';

// A controllable IntersectionObserver: tests decide when the box becomes visible.
let observers;
class FakeObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.disconnected = false;
    observers.push(this);
  }

  observe() {}

  unobserve() {}

  disconnect() { this.disconnected = true; }

  show() { this.callback([{ isIntersecting: true }]); }
}

const original = window.IntersectionObserver;
beforeEach(() => {
  observers = [];
  window.IntersectionObserver = FakeObserver;
});
afterEach(() => { window.IntersectionObserver = original; });

describe('Lazy', () => {
  it('holds back its children, and shows the placeholder, until it is near the screen', () => {
    render(<Lazy placeholder={<span>Waiting</span>}><span>Content</span></Lazy>);
    expect(screen.queryByText('Content')).toBeNull();
    expect(screen.getByText('Waiting')).toBeInTheDocument();

    act(() => observers[0].show());
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.queryByText('Waiting')).toBeNull();
  });

  it('keeps its place with minHeight, and marks itself busy, until the children show', () => {
    const { container } = render(<Lazy minHeight={120}><span>Content</span></Lazy>);
    expect(container.firstChild).toHaveStyle({ minHeight: '120px' });
    expect(container.firstChild).toHaveAttribute('aria-busy', 'true');

    act(() => observers[0].show());
    expect(container.firstChild).not.toHaveAttribute('aria-busy');
    expect(container.firstChild.style.minHeight).toBe('');
  });

  it('stops watching once the children have shown, and keeps them', () => {
    render(<Lazy><span>Content</span></Lazy>);
    act(() => observers[0].show());
    expect(observers[0].disconnected).toBe(true);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('uses rootMargin for what counts as near', () => {
    render(<Lazy rootMargin="50px"><span>Content</span></Lazy>);
    expect(observers[0].options.rootMargin).toBe('50px');
  });

  it('shows the children at once with load, and calls onLoad once', () => {
    const onLoad = jest.fn();
    const { rerender } = render(<Lazy load onLoad={onLoad}><span>Content</span></Lazy>);
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(observers).toHaveLength(0);
    expect(onLoad).toHaveBeenCalledTimes(1);

    rerender(<Lazy load onLoad={onLoad}><span>Content</span></Lazy>);
    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it('can be switched to load later', () => {
    const { rerender } = render(<Lazy load={false}><span>Content</span></Lazy>);
    expect(screen.queryByText('Content')).toBeNull();
    rerender(<Lazy load><span>Content</span></Lazy>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders the children straight away without IntersectionObserver', () => {
    delete window.IntersectionObserver;
    render(<Lazy><span>Content</span></Lazy>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders the element it is given and passes other props on', () => {
    const { container } = render(<Lazy as="section" className="mine" data-x="1" load><span>Content</span></Lazy>);
    expect(container.firstChild.tagName).toBe('SECTION');
    expect(container.firstChild).toHaveClass('volta-lazy', 'mine');
    expect(container.firstChild).toHaveAttribute('data-x', '1');
  });
});
