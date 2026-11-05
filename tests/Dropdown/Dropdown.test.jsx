import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Dropdown from '../../components/Dropdown/Dropdown';

const getOverlay = () => document.querySelector('.volta-overlay');

describe('Dropdown', () => {
  it('renders without crashing', () => {
    const { container } = render(<Dropdown />);
    expect(container).toBeInTheDocument();
  });

  it('shows the label on its button, closed to begin with', () => {
    const { container } = render(<Dropdown label="Options">Contents</Dropdown>);
    const button = screen.getByRole('button', { name: 'Options' });
    expect(button).toHaveAttribute('aria-haspopup', 'true');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(container.firstChild).not.toHaveClass('is-open');
    expect(getOverlay()).toBeNull();
  });

  describe('when it manages its own state', () => {
    it('opens and closes when the button is clicked, without needing onClick', () => {
      const { container } = render(<Dropdown label="Options">Contents</Dropdown>);
      const button = screen.getByRole('button', { name: 'Options' });

      fireEvent.click(button);
      expect(container.firstChild).toHaveClass('is-open');
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(getOverlay()).toHaveClass('showing');

      fireEvent.click(button);
      expect(container.firstChild).not.toHaveClass('is-open');
      expect(getOverlay()).toBeNull();
    });

    it('also calls onClick', () => {
      const onClick = jest.fn();
      render(<Dropdown label="Options" onClick={onClick}>Contents</Dropdown>);
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('closes when the overlay is clicked, calling onClose', () => {
      const onClose = jest.fn();
      const { container } = render(<Dropdown label="Options" onClose={onClose}>Contents</Dropdown>);
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));

      fireEvent.click(getOverlay());
      expect(container.firstChild).not.toHaveClass('is-open');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('closes when its contents are clicked', () => {
      const { container } = render(<Dropdown label="Options"><span>Choice</span></Dropdown>);
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));

      fireEvent.click(screen.getByText('Choice'));
      expect(container.firstChild).not.toHaveClass('is-open');
    });

    it('closes on Escape and puts focus back on the button', () => {
      const { container } = render(<Dropdown label="Options"><button type="button">Choice</button></Dropdown>);
      const button = screen.getByRole('button', { name: 'Options' });
      fireEvent.click(button);
      screen.getByText('Choice').focus();

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(container.firstChild).not.toHaveClass('is-open');
      expect(button).toHaveFocus();
    });

    it('ignores other keys', () => {
      const { container } = render(<Dropdown label="Options">Contents</Dropdown>);
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      fireEvent.keyDown(document, { key: 'a' });
      expect(container.firstChild).toHaveClass('is-open');
    });

    it('does not take focus back from something outside it', () => {
      const { container } = render(
        <>
          <input aria-label="Elsewhere" />
          <Dropdown label="Options">Contents</Dropdown>
        </>
      );
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      screen.getByLabelText('Elsewhere').focus();

      fireEvent.click(getOverlay());
      expect(container.querySelector('.volta-dropdown')).not.toHaveClass('is-open');
      expect(screen.getByLabelText('Elsewhere')).toHaveFocus();
    });

    it('has no overlay when showOverlay is false, but Escape still closes it', () => {
      const { container } = render(<Dropdown label="Options" showOverlay={false}>Contents</Dropdown>);
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      expect(container.firstChild).toHaveClass('is-open');
      expect(getOverlay()).toBeNull();

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(container.firstChild).not.toHaveClass('is-open');
    });

    it('removes its overlay and key listener when unmounted while open', () => {
      const onClose = jest.fn();
      const { unmount } = render(<Dropdown label="Options" onClose={onClose}>Contents</Dropdown>);
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      expect(getOverlay()).not.toBeNull();

      unmount();
      expect(getOverlay()).toBeNull();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('when the parent controls it with open', () => {
    it('follows the open prop and only reports clicks', () => {
      const onClick = jest.fn();
      const { container, rerender } = render(<Dropdown label="Options" open={false} onClick={onClick}>Contents</Dropdown>);

      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(container.firstChild).not.toHaveClass('is-open');

      rerender(<Dropdown label="Options" open onClick={onClick}>Contents</Dropdown>);
      expect(container.firstChild).toHaveClass('is-open');
      expect(screen.getByRole('button', { name: 'Options' })).toHaveAttribute('aria-expanded', 'true');
    });

    it('calls onClose for the overlay, a click on the contents and Escape', () => {
      const onClose = jest.fn();
      render(<Dropdown label="Options" open onClose={onClose}><span>Choice</span></Dropdown>);

      fireEvent.click(getOverlay());
      fireEvent.click(screen.getByText('Choice'));
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(3);
    });

    it('does not listen for Escape while closed', () => {
      const onClose = jest.fn();
      render(<Dropdown label="Options" open={false} onClose={onClose}>Contents</Dropdown>);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not crash on an open dropdown that has no onClose', () => {
      render(<Dropdown label="Options" open><span>Choice</span></Dropdown>);
      fireEvent.click(getOverlay());
      fireEvent.click(screen.getByText('Choice'));
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    it('can switch between controlled and managed without breaking hooks', () => {
      const { container, rerender } = render(<Dropdown label="Options">Contents</Dropdown>);
      rerender(<Dropdown label="Options" open>Contents</Dropdown>);
      expect(container.firstChild).toHaveClass('is-open');
      rerender(<Dropdown label="Options">Contents</Dropdown>);
      expect(container.firstChild).not.toHaveClass('is-open');
    });
  });

  it('uses buttonComponent in place of its own button', () => {
    const Wrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <Dropdown
          buttonComponent={<button type="button" onClick={() => setOpen(!open)}>Custom trigger</button>}
          open={open}
          onClose={() => setOpen(false)}
        >
          Contents
        </Dropdown>
      );
    };
    const { container } = render(<Wrapper />);
    expect(screen.getAllByRole('button')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Custom trigger' }));
    expect(container.firstChild).toHaveClass('is-open');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(container.firstChild).not.toHaveClass('is-open');
    expect(screen.getByRole('button', { name: 'Custom trigger' })).toHaveFocus();
  });

  it('adds className and constrainWidth classes', () => {
    const { container } = render(<Dropdown label="Options" className="extra" constrainWidth>Contents</Dropdown>);
    expect(container.firstChild).toHaveClass('volta-dropdown', 'extra', 'dropdown-constrain_width');
  });

  it('passes other props, such as disabled, to its button', () => {
    render(<Dropdown label="Options" disabled>Contents</Dropdown>);
    expect(screen.getByRole('button', { name: 'Options' })).toBeDisabled();
  });
});
