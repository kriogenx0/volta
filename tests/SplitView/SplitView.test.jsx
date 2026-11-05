import { render, fireEvent } from '@testing-library/react';

import SplitView from '../../components/SplitView/SplitView';

// jsdom has no layout, so offsetTop is always 0; let a test set it.
const setOffsetTop = (value) => {
  Object.defineProperty(HTMLElement.prototype, 'offsetTop', { configurable: true, get: () => value });
};

describe('SplitView', () => {
  afterEach(() => {
    delete HTMLElement.prototype.offsetTop;
  });

  it('renders without crashing', () => {
    const { container } = render(<SplitView />);
    expect(container).toBeInTheDocument();
  });

  it('renders the main content and the side content in their panes', () => {
    const { container } = render(<SplitView side={<span>Side text</span>}>Main text</SplitView>);
    expect(container.querySelector('.split_view-main')).toHaveTextContent('Main text');
    expect(container.querySelector('.split_view-side')).toHaveTextContent('Side text');
  });

  it('marks the side pane open only when open is set', () => {
    const { container, rerender } = render(<SplitView side="Side">Main</SplitView>);
    expect(container.firstChild).not.toHaveClass('split_view-open');
    rerender(<SplitView open side="Side">Main</SplitView>);
    expect(container.firstChild).toHaveClass('split_view-open');
  });

  it('fits the window below its top edge by default', () => {
    setOffsetTop(48);
    const { container } = render(<SplitView>Main</SplitView>);
    expect(container.firstChild.style.height).toBe('calc(100vh - 48px)');
  });

  it('refits the window when it is resized', () => {
    setOffsetTop(48);
    const { container } = render(<SplitView>Main</SplitView>);
    setOffsetTop(80);
    fireEvent(window, new Event('resize'));
    expect(container.firstChild.style.height).toBe('calc(100vh - 80px)');
  });

  it('leaves the height alone with setScrollHeight off', () => {
    setOffsetTop(48);
    const { container } = render(<SplitView setScrollHeight={false}>Main</SplitView>);
    fireEvent(window, new Event('resize'));
    expect(container.firstChild.style.height).toBe('');
  });

  it('stops listening for resizes once unmounted', () => {
    const remove = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<SplitView>Main</SplitView>);
    unmount();
    expect(remove).toHaveBeenCalledWith('resize', expect.any(Function));
    remove.mockRestore();
  });
});
