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
    it('does not dim the page by default, and closes on a click outside it', () => {
      const onClose = jest.fn();
      const { container } = render(<Dropdown label="Options" onClose={onClose}>Contents</Dropdown>);
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      expect(container.firstChild).toHaveClass('is-open');
      expect(getOverlay()).toBeNull();
      fireEvent.mouseDown(document.body);
      expect(container.firstChild).not.toHaveClass('is-open');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('opens and closes when the button is clicked, without needing onClick', () => {
      const { container } = render(<Dropdown label="Options" showOverlay>Contents</Dropdown>);
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
      const { container } = render(<Dropdown label="Options" showOverlay onClose={onClose}>Contents</Dropdown>);
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));

      fireEvent.click(getOverlay());
      expect(container.firstChild).not.toHaveClass('is-open');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('stays open when something inside it is clicked', () => {
      const { container } = render(<Dropdown label="Options"><button type="button">Next month</button></Dropdown>);
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));

      fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
      expect(container.firstChild).toHaveClass('is-open');
    });

    it('closes when a data-dropdown-close element, or something inside it, is clicked', () => {
      const { container } = render(
        <Dropdown label="Options">
          <button type="button" data-dropdown-close><span>Choose</span></button>
        </Dropdown>
      );
      const open = () => fireEvent.click(screen.getByRole('button', { name: 'Options' }));

      open();
      fireEvent.click(screen.getByRole('button', { name: 'Choose' }));
      expect(container.firstChild).not.toHaveClass('is-open');

      open();
      fireEvent.click(screen.getByText('Choose'));
      expect(container.firstChild).not.toHaveClass('is-open');
    });

    it('closes on any click inside with closeOnContentClick', () => {
      const { container } = render(<Dropdown label="Options" closeOnContentClick><span>Anything</span></Dropdown>);
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));

      fireEvent.click(screen.getByText('Anything'));
      expect(container.firstChild).not.toHaveClass('is-open');
    });

    it('closes on a click outside when it has no overlay, but not on one inside', () => {
      const onClose = jest.fn();
      const { container } = render(
        <>
          <p>Elsewhere</p>
          <Dropdown label="Options" showOverlay={false} onClose={onClose}><span>Inside</span></Dropdown>
        </>
      );
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));

      fireEvent.mouseDown(screen.getByText('Inside'));
      fireEvent.mouseDown(screen.getByRole('button', { name: 'Options' }));
      expect(container.querySelector('.volta-dropdown')).toHaveClass('is-open');
      expect(onClose).not.toHaveBeenCalled();

      fireEvent.mouseDown(screen.getByText('Elsewhere'));
      expect(container.querySelector('.volta-dropdown')).not.toHaveClass('is-open');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not listen for outside clicks while closed or once it is gone', () => {
      const onClose = jest.fn();
      const { unmount } = render(<Dropdown label="Options" showOverlay={false} onClose={onClose}>Contents</Dropdown>);
      fireEvent.mouseDown(document.body);
      expect(onClose).not.toHaveBeenCalled();

      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      unmount();
      fireEvent.mouseDown(document.body);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('leaves outside clicks to the overlay when there is one', () => {
      const onClose = jest.fn();
      render(<Dropdown label="Options" showOverlay onClose={onClose}>Contents</Dropdown>);
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));

      fireEvent.mouseDown(document.body);
      expect(onClose).not.toHaveBeenCalled();
      fireEvent.click(getOverlay());
      expect(onClose).toHaveBeenCalledTimes(1);
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
          <Dropdown label="Options" showOverlay>Contents</Dropdown>
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
      const { unmount } = render(<Dropdown label="Options" showOverlay onClose={onClose}>Contents</Dropdown>);
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

    it('calls onClose for the overlay, a choice and Escape, but not for other clicks inside', () => {
      const onClose = jest.fn();
      render(<Dropdown label="Options" open showOverlay onClose={onClose}><span>Other</span><span data-dropdown-close>Choice</span></Dropdown>);

      fireEvent.click(screen.getByText('Other'));
      expect(onClose).not.toHaveBeenCalled();

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
      render(<Dropdown label="Options" open showOverlay><span>Choice</span></Dropdown>);
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

  describe('placement', () => {
    // jsdom has no layout, so say where the trigger is and how tall the panel is.
    const layout = ({ top, bottom, panelHeight, viewportHeight = 768 }) => {
      jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ top, bottom, left: 0, right: 100, width: 100, height: bottom - top });
      jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(panelHeight);
      window.innerHeight = viewportHeight;
    };

    afterEach(() => {
      jest.restoreAllMocks();
      window.innerHeight = 768;
    });

    const panel = (container) => container.querySelector('.dropdown-contents');

    it('opens below the trigger by default', () => {
      const { container } = render(<Dropdown label="Options">Contents</Dropdown>);
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      expect(panel(container)).not.toHaveClass('dropdown-contents--above');
    });

    it('opens below when it fits', () => {
      layout({ top: 100, bottom: 130, panelHeight: 200 });
      const { container } = render(<Dropdown label="Options">Contents</Dropdown>);
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      expect(panel(container)).not.toHaveClass('dropdown-contents--above');
    });

    it('opens above when it does not fit below and there is more room above', () => {
      layout({ top: 700, bottom: 730, panelHeight: 200 });
      const { container } = render(<Dropdown label="Options">Contents</Dropdown>);
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      expect(panel(container)).toHaveClass('dropdown-contents--above');
    });

    it('works out the side again each time it opens', () => {
      layout({ top: 700, bottom: 730, panelHeight: 200 });
      const { container } = render(<Dropdown label="Options">Contents</Dropdown>);
      const button = screen.getByRole('button', { name: 'Options' });
      fireEvent.click(button);
      expect(panel(container)).toHaveClass('dropdown-contents--above');

      fireEvent.click(button);
      jest.restoreAllMocks();
      layout({ top: 100, bottom: 130, panelHeight: 200 });
      fireEvent.click(button);
      expect(panel(container)).not.toHaveClass('dropdown-contents--above');
    });
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
