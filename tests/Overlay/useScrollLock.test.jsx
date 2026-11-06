import { render } from '@testing-library/react';

import useScrollLock from '../../components/Overlay/useScrollLock';

const Locker = ({ active = true }) => {
  useScrollLock(active);
  return null;
};

// jsdom has no layout, so give the page a scrollbar of a known width.
const withScrollbar = (width) => {
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 1000 });
  window.innerWidth = 1000 + width;
};

afterEach(() => {
  document.body.removeAttribute('style');
  delete document.documentElement.clientWidth;
  window.innerWidth = 1024;
});

describe('useScrollLock', () => {
  it('stops the page scrolling while mounted and lets it scroll again afterwards', () => {
    const { unmount } = render(<Locker />);
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('does nothing while inactive, and locks when it becomes active', () => {
    const { rerender } = render(<Locker active={false} />);
    expect(document.body.style.overflow).toBe('');
    rerender(<Locker active />);
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<Locker active={false} />);
    expect(document.body.style.overflow).toBe('');
  });

  it('keeps the page locked until the last of several locks is released', () => {
    const first = render(<Locker />);
    const second = render(<Locker />);
    first.unmount();
    expect(document.body.style.overflow).toBe('hidden');
    second.unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('puts back the inline overflow and padding the body had', () => {
    document.body.style.overflow = 'scroll';
    document.body.style.paddingRight = '5px';
    const { unmount } = render(<Locker />);
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('scroll');
    expect(document.body.style.paddingRight).toBe('5px');
  });

  it('adds the scrollbar\'s width as padding so the page does not jump sideways', () => {
    withScrollbar(15);
    const { unmount } = render(<Locker />);
    expect(document.body.style.paddingRight).toBe('15px');
    unmount();
    expect(document.body.style.paddingRight).toBe('');
  });

  it('adds to padding the body already has', () => {
    withScrollbar(15);
    document.body.style.paddingRight = '10px';
    const { unmount } = render(<Locker />);
    expect(document.body.style.paddingRight).toBe('25px');
    unmount();
    expect(document.body.style.paddingRight).toBe('10px');
  });

  it('adds no padding when there is no scrollbar to replace', () => {
    withScrollbar(0);
    const { unmount } = render(<Locker />);
    expect(document.body.style.paddingRight).toBe('');
    unmount();
  });

  it('still locks and unlocks cleanly after being locked twice over', () => {
    const a = render(<Locker />);
    const b = render(<Locker />);
    a.unmount();
    b.unmount();
    const c = render(<Locker />);
    expect(document.body.style.overflow).toBe('hidden');
    c.unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
