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

describe('SplitView resizing', () => {
  const handle = (container) => container.querySelector('.split_view-handle');
  const side = (container) => container.querySelector('.split_view-side');

  // jsdom has no layout: give the view a width, and let the side pane report the one it has
  const withLayout = (container, { viewWidth = 1000, sideWidth = 200 } = {}) => {
    Object.defineProperty(container.querySelector('.volta-split_view'), 'offsetWidth', { configurable: true, value: viewWidth });
    Object.defineProperty(side(container), 'offsetWidth', { configurable: true, value: sideWidth });
  };

  it('has a divider between the panes while the side pane is open', () => {
    const { container, rerender } = render(<SplitView open side={<span>Side</span>}>Main</SplitView>);
    expect(handle(container)).toBeInTheDocument();
    const order = [...container.querySelector('.volta-split_view').children].map((child) => child.className);
    expect(order).toEqual(['split_view-main', 'split_view-handle', 'split_view-side']);
    rerender(<SplitView side={<span>Side</span>}>Main</SplitView>);
    expect(handle(container)).toBeNull();
  });

  it('is an accessible separator with the limits it works within', () => {
    const { container } = render(<SplitView open minSideWidth={120} maxSideWidth={500} defaultSideWidth={260} side="Side">Main</SplitView>);
    const divider = handle(container);
    expect(divider).toHaveAttribute('role', 'separator');
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
    expect(divider).toHaveAttribute('aria-label', 'Resize side pane');
    expect(divider).toHaveAttribute('aria-valuemin', '120');
    expect(divider).toHaveAttribute('aria-valuemax', '500');
    expect(divider).toHaveAttribute('aria-valuenow', '260');
    expect(divider).toHaveAttribute('tabindex', '0');
  });

  it('can be turned off with resizable={false}', () => {
    const { container } = render(<SplitView open resizable={false} side="Side">Main</SplitView>);
    expect(handle(container)).toBeNull();
  });

  it('starts as wide as its content, then at defaultSideWidth when given', () => {
    const { container } = render(<SplitView open side="Side">Main</SplitView>);
    expect(side(container).style.width).toBe('');
    const sized = render(<SplitView open defaultSideWidth={300} side="Side">Main</SplitView>);
    expect(side(sized.container)).toHaveStyle({ width: '300px' });
  });

  it('makes the side pane wider as the divider is dragged left, and narrower as it is dragged right', () => {
    const onResize = jest.fn();
    const { container } = render(<SplitView open defaultSideWidth={300} onResize={onResize} side="Side">Main</SplitView>);
    withLayout(container);
    fireEvent.mouseDown(handle(container), { clientX: 600, button: 0 });
    fireEvent.mouseMove(document, { clientX: 550 });
    expect(side(container)).toHaveStyle({ width: '350px' });
    expect(onResize).toHaveBeenLastCalledWith(350);
    fireEvent.mouseMove(document, { clientX: 650 });
    expect(side(container)).toHaveStyle({ width: '250px' });
    fireEvent.mouseUp(document);
    onResize.mockClear();
    fireEvent.mouseMove(document, { clientX: 100 });
    expect(onResize).not.toHaveBeenCalled();
  });

  it('starts from the width the pane has when it was only as wide as its content', () => {
    const { container } = render(<SplitView open side="Side">Main</SplitView>);
    withLayout(container, { sideWidth: 220 });
    fireEvent.mouseDown(handle(container), { clientX: 500, button: 0 });
    fireEvent.mouseMove(document, { clientX: 480 });
    expect(side(container)).toHaveStyle({ width: '240px' });
  });

  it('works by touch too', () => {
    const { container } = render(<SplitView open defaultSideWidth={200} side="Side">Main</SplitView>);
    withLayout(container);
    fireEvent.touchStart(handle(container), { touches: [{ clientX: 400 }] });
    fireEvent.touchMove(document, { touches: [{ clientX: 350 }] });
    expect(side(container)).toHaveStyle({ width: '250px' });
    fireEvent.touchEnd(document);
  });

  it('keeps the side pane between its minimum and maximum, and leaves room for the main pane', () => {
    const { container } = render(<SplitView open defaultSideWidth={300} minSideWidth={150} maxSideWidth={500} side="Side">Main</SplitView>);
    withLayout(container, { viewWidth: 600 });
    fireEvent.mouseDown(handle(container), { clientX: 400, button: 0 });
    fireEvent.mouseMove(document, { clientX: 0 });
    expect(side(container)).toHaveStyle({ width: '450px' }); // 600 view - 150 min for the main pane
    fireEvent.mouseMove(document, { clientX: 5000 });
    expect(side(container)).toHaveStyle({ width: '150px' });
  });

  it('moves with the arrow keys, Page keys, Home and End', () => {
    const onResize = jest.fn();
    const { container } = render(<SplitView open defaultSideWidth={300} minSideWidth={150} maxSideWidth={500} onResize={onResize} side="Side">Main</SplitView>);
    withLayout(container);
    const press = (key) => fireEvent.keyDown(handle(container), { key });
    press('ArrowLeft');
    expect(side(container)).toHaveStyle({ width: '316px' });
    press('ArrowRight');
    press('ArrowRight');
    expect(side(container)).toHaveStyle({ width: '284px' });
    press('PageUp');
    expect(side(container)).toHaveStyle({ width: '348px' });
    press('Home');
    expect(side(container)).toHaveStyle({ width: '150px' });
    press('End');
    expect(side(container)).toHaveStyle({ width: '500px' });
    expect(onResize).toHaveBeenLastCalledWith(500);
  });

  it('leaves other keys alone', () => {
    const { container } = render(<SplitView open defaultSideWidth={300} side="Side">Main</SplitView>);
    expect(fireEvent.keyDown(handle(container), { key: 'a' })).toBe(true);
  });

  it('lets the caller hold the width: it reports, and shows what it is given', () => {
    const onResize = jest.fn();
    const { container, rerender } = render(<SplitView open sideWidth={240} onResize={onResize} side="Side">Main</SplitView>);
    withLayout(container);
    fireEvent.keyDown(handle(container), { key: 'ArrowLeft' });
    expect(onResize).toHaveBeenCalledWith(256);
    expect(side(container)).toHaveStyle({ width: '240px' });
    rerender(<SplitView open sideWidth={256} onResize={onResize} side="Side">Main</SplitView>);
    expect(side(container)).toHaveStyle({ width: '256px' });
  });

  it('has no width of its own while closed, and follows the pointer with no delay while dragging', () => {
    const { container, rerender } = render(<SplitView defaultSideWidth={300} side="Side">Main</SplitView>);
    expect(side(container).style.width).toBe('');
    rerender(<SplitView open defaultSideWidth={300} side="Side">Main</SplitView>);
    withLayout(container);
    fireEvent.mouseDown(handle(container), { clientX: 500, button: 0 });
    expect(container.firstChild).toHaveClass('split_view-dragging');
    fireEvent.mouseUp(document);
    expect(container.firstChild).not.toHaveClass('split_view-dragging');
  });

  it('ignores a right-click on the divider', () => {
    const { container } = render(<SplitView open defaultSideWidth={300} side="Side">Main</SplitView>);
    fireEvent.mouseDown(handle(container), { clientX: 500, button: 2 });
    expect(container.firstChild).not.toHaveClass('split_view-dragging');
  });
});
