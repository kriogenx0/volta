import { render, screen, fireEvent } from '@testing-library/react';
import { jsx } from 'react/jsx-runtime';

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

  it('removes the overlay element when it closes or unmounts', () => {
    const { rerender, unmount } = render(<PopOver open />);
    rerender(<PopOver open={false} />);
    expect(document.querySelector('.overlay')).not.toBeInTheDocument();
    rerender(<PopOver open />);
    unmount();
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

  describe('open state', () => {
    it('is only marked open when open is set', () => {
      const { container, rerender } = render(<PopOver>Content</PopOver>);
      expect(container.firstChild).not.toHaveClass('pop_over-open');
      rerender(<PopOver open>Content</PopOver>);
      expect(container.firstChild).toHaveClass('pop_over-open');
    });

    it('is full size by default, and in place with fullSize off', () => {
      const { container, rerender } = render(<PopOver open>Content</PopOver>);
      expect(container.firstChild).toHaveClass('pop_over-full');
      expect(container.querySelector('.inner-overlay')).not.toBeInTheDocument();
      rerender(<PopOver open fullSize={false}>Content</PopOver>);
      expect(container.firstChild).not.toHaveClass('pop_over-full');
      expect(container.querySelector('.inner-overlay')).toBeInTheDocument();
    });

    it('applies its defaults under the automatic JSX runtime used by the Vite build', () => {
      // defaultProps are ignored on function components by that runtime
      const { container } = render(jsx(PopOver, { open: true, children: 'Content' }));
      expect(container.firstChild).toHaveClass('pop_over-full');
    });

    it('adds a custom className', () => {
      const { container } = render(<PopOver open className="my-popover">Content</PopOver>);
      expect(container.firstChild).toHaveClass('volta-pop_over', 'my-popover');
    });
  });

  describe('closing', () => {
    it('calls handleClose when the backdrop is clicked, but not when the content is', () => {
      const handleClose = jest.fn();
      const { container } = render(<PopOver open handleClose={handleClose}><button type="button">Inside</button></PopOver>);
      fireEvent.click(screen.getByText('Inside'));
      expect(handleClose).not.toHaveBeenCalled();
      fireEvent.click(container.firstChild);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('ignores backdrop clicks without closeOnOverlayClick', () => {
      const handleClose = jest.fn();
      const { container } = render(<PopOver open closeOnOverlayClick={false} handleClose={handleClose} />);
      fireEvent.click(container.firstChild);
      expect(handleClose).not.toHaveBeenCalled();
    });

    it('calls handleClose when the in-place click-catcher is clicked', () => {
      const handleClose = jest.fn();
      const { container } = render(<PopOver open fullSize={false} handleClose={handleClose} />);
      fireEvent.click(container.querySelector('.inner-overlay'));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('calls handleClose on Escape while open', () => {
      const handleClose = jest.fn();
      render(<PopOver open handleClose={handleClose} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('ignores Escape while closed, and without closeOnOverlayClick', () => {
      const handleClose = jest.fn();
      const { rerender } = render(<PopOver handleClose={handleClose} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      rerender(<PopOver open closeOnOverlayClick={false} handleClose={handleClose} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleClose).not.toHaveBeenCalled();
    });

    it('does not throw without a handleClose', () => {
      const { container } = render(<PopOver open />);
      expect(() => {
        fireEvent.click(container.firstChild);
        fireEvent.keyDown(document, { key: 'Escape' });
      }).not.toThrow();
    });
  });

  describe('accessibility', () => {
    it('is a dialog named by aria-label', () => {
      render(<PopOver open aria-label="Settings">Content</PopOver>);
      expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
    });

    it('does not point aria-labelledby at an element that is not there', () => {
      const { container } = render(<PopOver open>Content</PopOver>);
      expect(container.firstChild).not.toHaveAttribute('aria-labelledby');
    });
  });
});
