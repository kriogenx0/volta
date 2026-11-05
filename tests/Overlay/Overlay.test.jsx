import { render, fireEvent } from '@testing-library/react';

import Overlay from '../../components/Overlay/Overlay';

const overlays = () => document.querySelectorAll('.volta-overlay');

describe('Overlay', () => {
  it('renders without crashing', () => {
    const { container } = render(<Overlay />);
    expect(container).toBeInTheDocument();
  });

  it('renders nothing in place', () => {
    const { container } = render(<Overlay showing>Ignored</Overlay>);
    expect(container).toBeEmptyDOMElement();
  });

  it('adds nothing to the page while it is not showing', () => {
    render(<Overlay showing={false} />);
    expect(overlays()).toHaveLength(0);
  });

  it('adds one showing layer to the body while showing', () => {
    render(<Overlay showing />);
    expect(overlays()).toHaveLength(1);
    expect(overlays()[0]).toHaveClass('showing');
    expect(overlays()[0].parentNode).toBe(document.body);
  });

  it('adds and removes the layer as showing changes', () => {
    const { rerender } = render(<Overlay showing={false} />);
    rerender(<Overlay showing />);
    expect(overlays()).toHaveLength(1);
    rerender(<Overlay showing={false} />);
    expect(overlays()).toHaveLength(0);
  });

  it('removes the layer when unmounted', () => {
    const { unmount } = render(<Overlay showing />);
    unmount();
    expect(overlays()).toHaveLength(0);
  });

  it('calls onClick when the layer is clicked', () => {
    const onClick = jest.fn();
    render(<Overlay showing onClick={onClick} />);
    fireEvent.click(overlays()[0]);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('can be clicked without an onClick', () => {
    render(<Overlay showing />);
    expect(() => fireEvent.click(overlays()[0])).not.toThrow();
  });

  it('keeps only one layer across re-renders with a new onClick', () => {
    const { rerender } = render(<Overlay showing onClick={() => {}} />);
    rerender(<Overlay showing onClick={() => {}} />);
    expect(overlays()).toHaveLength(1);
  });
});
