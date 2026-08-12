import { render, screen, fireEvent } from '@testing-library/react';

import PopOver from '../../components/PopOver/PopOver';

describe('PopOver', () => {
  it('renders its children', () => {
    render(<PopOver open>Dialog content</PopOver>);
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  it('appends an overlay element to the body while open', () => {
    render(<PopOver open />);
    expect(document.querySelector('.overlay')).toBeInTheDocument();
  });

  it('does not append an overlay element when closed', () => {
    render(<PopOver open={false} />);
    expect(document.querySelector('.overlay')).not.toBeInTheDocument();
  });

  it('calls handleClose when the overlay is clicked and closeOnOverlayClick is set', () => {
    const handleClose = jest.fn();
    render(<PopOver open closeOnOverlayClick handleClose={handleClose} />);
    fireEvent.click(document.querySelector('.overlay'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not throw when clicking the inner overlay in non-fullSize mode', () => {
    render(<PopOver open fullSize={false} closeOnOverlayClick />);
    expect(() => fireEvent.click(document.querySelector('.inner-overlay'))).not.toThrow();
  });
});
