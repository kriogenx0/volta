import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AlertExamples from '../../examples/ModalAlert/Alert-examples';
import DialogExamples from '../../examples/Dialog/Dialog-examples';
import DrawerExamples from '../../examples/Drawer/Drawer-examples';
import LayerExamples from '../../examples/Layer/Layer-examples';
import ModalDialogExamples from '../../examples/ModalDialog/ModalDialog-examples';
import ModalExamples from '../../examples/Modal/Modal-examples';
import OverlayExamples from '../../examples/Overlay/Overlay-examples';
import PopOverExamples from '../../examples/PopOver/PopOver-examples';
import SplitViewExamples from '../../examples/SplitView/SplitView-examples';

// The examples of the overlay components (Drawer, SplitView, Overlay, Layer,
// Dialog, Modal, ModalDialog, Alert, PopOver) start closed, so the generic
// examples test only renders their closed state. These open each one and walk
// through using it, the way someone in the styleguide would.
const MODULES = [
  DrawerExamples, SplitViewExamples, OverlayExamples, LayerExamples, DialogExamples,
  ModalExamples, ModalDialogExamples, AlertExamples, PopOverExamples
];

const show = (module, name) => {
  const example = module.examples.find((item) => item.name === name);
  render(<MemoryRouter>{example.output}</MemoryRouter>);
};

const click = (name) => fireEvent.click(screen.getByRole('button', { name }));

describe('overlay examples', () => {
  let consoleError;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    expect(consoleError.mock.calls.map((args) => String(args[0]).split('\n')[0])).toEqual([]);
    consoleError.mockRestore();
  });

  describe.each(MODULES.flatMap((module) => module.examples.map((example) => [module.name, example.name])))('%s: %s', (moduleName, exampleName) => {
    it('renders, can have its first button pressed and Escape sent, without errors', () => {
      const module = MODULES.find((item) => item.name === moduleName);
      show(module, exampleName);
      const [first] = screen.queryAllByRole('button');
      if (first) fireEvent.click(first);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Drawer', () => {
    it('opens from the button, then closes from Done, the scrim and Escape', () => {
      show(DrawerExamples, 'Open and close');
      const drawer = () => document.querySelector('.volta-drawer');
      expect(drawer()).not.toHaveClass('drawer-open');
      click('Open drawer');
      expect(drawer()).toHaveClass('drawer-open');
      click('Done');
      expect(drawer()).not.toHaveClass('drawer-open');
      click('Open drawer');
      fireEvent.click(document.querySelector('.drawer-overlay'));
      expect(drawer()).not.toHaveClass('drawer-open');
      click('Open drawer');
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(drawer()).not.toHaveClass('drawer-open');
    });

    it('applies the width it is given', () => {
      show(DrawerExamples, 'Fixed width');
      expect(document.querySelector('.drawer-contents')).toHaveStyle({ width: '320px' });
    });

    it('starts open when asked to', () => {
      show(DrawerExamples, 'Open on load');
      expect(document.querySelector('.volta-drawer')).toHaveClass('drawer-open');
    });
  });

  describe('SplitView', () => {
    it('toggles the side pane', () => {
      show(SplitViewExamples, 'Toggle the side pane');
      const view = () => document.querySelector('.volta-split_view');
      expect(view()).toHaveClass('split_view-open');
      click('Hide side pane');
      expect(view()).not.toHaveClass('split_view-open');
      click('Show side pane');
      expect(view()).toHaveClass('split_view-open');
    });
  });

  describe('Overlay', () => {
    it('dims the page until the dimmed area is clicked', () => {
      show(OverlayExamples, 'Dismiss on click');
      expect(document.querySelector('.volta-overlay')).not.toBeInTheDocument();
      click('Dim the page');
      expect(screen.getByText('The overlay is showing.')).toBeInTheDocument();
      fireEvent.click(document.querySelector('.volta-overlay'));
      expect(document.querySelector('.volta-overlay')).not.toBeInTheDocument();
      expect(screen.getByText('The overlay is hidden.')).toBeInTheDocument();
    });

    it('shows a panel that closes from its button and from the dimmed area', () => {
      show(OverlayExamples, 'With a panel above it');
      click('Show panel');
      expect(screen.getByRole('dialog', { name: 'Panel over the overlay' })).toBeInTheDocument();
      click('Close');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(document.querySelector('.volta-overlay')).not.toBeInTheDocument();
      click('Show panel');
      fireEvent.click(document.querySelector('.volta-overlay'));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('blocks the page for a moment and then lets go', () => {
      jest.useFakeTimers();
      show(OverlayExamples, 'Block the page while busy');
      click('Start a 2 second task');
      expect(document.querySelector('.volta-overlay')).toBeInTheDocument();
      fireEvent.click(document.querySelector('.volta-overlay'));
      expect(document.querySelector('.volta-overlay')).toBeInTheDocument();
      act(() => jest.advanceTimersByTime(2000));
      expect(document.querySelector('.volta-overlay')).not.toBeInTheDocument();
      jest.useRealTimers();
    });
  });

  describe('Layer', () => {
    it('renders the panel outside the example and closes it', () => {
      show(LayerExamples, 'Render into the page');
      click('Open layer');
      const panel = screen.getByRole('dialog', { name: 'Layer' });
      expect(panel.closest('.volta-layer').parentNode).toBe(document.body);
      click('Close');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(document.querySelector('.volta-layer')).not.toBeInTheDocument();
    });

    it('stacks the layer opened last on top', () => {
      show(LayerExamples, 'Stacking order');
      click('Open second layer');
      click('Open first layer');
      const order = Array.from(document.querySelectorAll('.volta-layer')).map((layer) => within(layer).getByRole('dialog').getAttribute('aria-label'));
      expect(order).toEqual(['Second layer', 'First layer']);
      click('Close second');
      click('Close first');
      expect(document.querySelector('.volta-layer')).not.toBeInTheDocument();
    });

    it('counts clicks that bubble out of the layer, but not stopped ones', () => {
      show(LayerExamples, 'Events bubble through the portal');
      click('Open layer');
      expect(screen.getByText('Clicks that bubbled up to the parent: 0')).toBeInTheDocument();
      click('Stopped');
      expect(screen.getByText('Clicks that bubbled up to the parent: 0')).toBeInTheDocument();
      click('Close (bubbles)');
      expect(screen.getByText('Clicks that bubbled up to the parent: 1')).toBeInTheDocument();
    });
  });

  describe('Dialog', () => {
    it('opens, saves and can be opened again', () => {
      show(DialogExamples, 'Title, Save and Cancel');
      const dialog = () => document.querySelector('.volta-dialog');
      expect(dialog()).not.toHaveClass('pop_over-open');
      click('Open dialog');
      expect(dialog()).toHaveClass('pop_over-open');
      click('Save Changes');
      expect(dialog()).not.toHaveClass('pop_over-open');
      expect(screen.getByText('Last action: Saved')).toBeInTheDocument();
      click('Open dialog');
      expect(dialog()).toHaveClass('pop_over-open');
      click('Cancel');
      expect(dialog()).not.toHaveClass('pop_over-open');
      expect(screen.getByText('Last action: Closed')).toBeInTheDocument();
    });

    it('enables Save once the field is filled in', () => {
      show(DialogExamples, 'Save disabled until valid');
      click('Open dialog');
      expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
      fireEvent.change(screen.getByLabelText('Tag name'), { target: { value: 'urgent' } });
      expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled();
    });

    it('closes on a click outside and on Escape when asked to', () => {
      show(DialogExamples, 'Close on overlay click');
      const dialog = () => document.querySelector('.volta-dialog');
      click('Open dialog');
      fireEvent.click(dialog());
      expect(dialog()).not.toHaveClass('pop_over-open');
      click('Open dialog');
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(dialog()).not.toHaveClass('pop_over-open');
    });

    it('shows the inline dialog again after it is closed', () => {
      show(DialogExamples, 'Inline mode');
      const dialog = () => document.querySelector('.volta-dialog');
      expect(dialog()).toHaveClass('pop_over-open', 'inline-mode');
      click('Cancel');
      expect(dialog()).not.toHaveClass('pop_over-open');
      click('Show again');
      expect(dialog()).toHaveClass('pop_over-open');
    });
  });

  describe('Modal', () => {
    it('opens and closes the titled modal', () => {
      show(ModalExamples, 'Titled modal');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      click('Open modal');
      expect(screen.getByRole('dialog', { name: 'Delete item' })).toBeInTheDocument();
      click('Keep');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      click('Open modal');
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('saves the name typed in the form modal', () => {
      show(ModalExamples, 'With a form');
      click('Rename');
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: ' Apollo ' } });
      click('Save');
      expect(screen.getByText('Saved name: Apollo')).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows the container form and hides it from the backdrop', () => {
      show(ModalExamples, 'Container form (show and onHide)');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      click('Open modal');
      expect(screen.getByRole('dialog', { name: 'Heading' })).toBeInTheDocument();
      fireEvent.click(document.querySelector('.volta-modal'));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('ModalDialog', () => {
    it('opens, answers OK, and can be opened again', () => {
      show(ModalDialogExamples, 'OK and Cancel');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      click('Open dialog');
      expect(screen.getByRole('dialog')).toHaveTextContent('Apply these changes?');
      click('OK');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.getByText('Last action: OK')).toBeInTheDocument();
      click('Open dialog');
      click('Cancel');
      expect(screen.getByText('Last action: Cancel')).toBeInTheDocument();
    });

    it('cancels from the X', () => {
      show(ModalDialogExamples, 'Title with a close X');
      click('Open dialog');
      click('Close');
      expect(screen.getByText('Last action: Cancel')).toBeInTheDocument();
    });

    it('enables OK once the field is filled in', () => {
      show(ModalDialogExamples, 'OK disabled until valid');
      click('Open dialog');
      expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled();
      fireEvent.change(screen.getByLabelText('Folder name'), { target: { value: 'Reports' } });
      expect(screen.getByRole('button', { name: 'Create' })).toBeEnabled();
    });

    it('ignores the backdrop and Escape when only the buttons should close it', () => {
      show(ModalDialogExamples, 'Only the buttons close it');
      click('Open dialog');
      fireEvent.click(document.querySelector('.volta-modal'));
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      click('Got it');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('shows the inline dialog again after it is closed', () => {
      show(ModalDialogExamples, 'Inline mode');
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      click('Cancel');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      click('Show again');
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Alert', () => {
    it('confirms and cancels', () => {
      show(AlertExamples, 'Confirm');
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
      click('Delete file');
      expect(screen.getByRole('alertdialog', { name: 'Delete this file?' })).toBeInTheDocument();
      fireEvent.click(screen.getByText('Delete'));
      expect(screen.getByText('Answer: confirmed')).toBeInTheDocument();
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
      click('Delete file');
      fireEvent.click(screen.getByText('Cancel'));
      expect(screen.getByText('Answer: cancelled')).toBeInTheDocument();
    });

    it('does not confirm when it is opened with the Enter key', () => {
      show(AlertExamples, 'Confirm');
      const open = screen.getByRole('button', { name: 'Delete file' });
      fireEvent.keyDown(open, { key: 'Enter' });
      fireEvent.click(open);
      fireEvent.keyUp(open, { key: 'Enter' });
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      expect(screen.getByText('Answer: nothing yet')).toBeInTheDocument();
    });

    it('prompts for text', () => {
      show(AlertExamples, 'Prompt for text');
      click('Rename file');
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'notes.txt' } });
      fireEvent.click(screen.getByText('Confirm'));
      expect(screen.getByText('Answer: "notes.txt"')).toBeInTheDocument();
    });

    it('cancels on Escape', () => {
      show(AlertExamples, 'Custom button labels');
      click('Leave page');
      expect(screen.getByText('Stay')).toBeInTheDocument();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.getByText('Answer: cancelled')).toBeInTheDocument();
    });
  });

  describe('PopOver', () => {
    it('opens and closes from the button, the backdrop and Escape', () => {
      show(PopOverExamples, 'Full size (default)');
      const popover = () => document.querySelector('.volta-pop_over');
      expect(popover()).not.toHaveClass('pop_over-open');
      click('Open popover');
      expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
      expect(popover()).toHaveClass('pop_over-open');
      click('Close');
      expect(popover()).not.toHaveClass('pop_over-open');
      click('Open popover');
      fireEvent.click(popover());
      expect(popover()).not.toHaveClass('pop_over-open');
      click('Open popover');
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(popover()).not.toHaveClass('pop_over-open');
    });

    it('stays open on the backdrop and Escape when only the button should close it', () => {
      show(PopOverExamples, 'Only the button closes it');
      const popover = () => document.querySelector('.volta-pop_over');
      click('Open popover');
      fireEvent.click(popover());
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(popover()).toHaveClass('pop_over-open');
      click('Close');
      expect(popover()).not.toHaveClass('pop_over-open');
    });

    it('picks an item from the in-place menu', () => {
      show(PopOverExamples, 'In place (fullSize off)');
      const popover = () => document.querySelector('.volta-pop_over');
      click('Sort by');
      expect(popover()).toHaveClass('pop_over-open');
      click('Date');
      expect(screen.getByText('Picked: Date')).toBeInTheDocument();
      expect(popover()).not.toHaveClass('pop_over-open');
    });
  });
});
