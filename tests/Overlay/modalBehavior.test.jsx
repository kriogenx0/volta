import { useState } from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';

import Alert from '../../components/ModalAlert/Alert';
import Dialog, { ModalDialog } from '../../components/Dialog/Dialog';
import Modal, { PopOver } from '../../components/Modal/Modal';
import Overlay from '../../components/Overlay/Overlay';

const escape = () => fireEvent.keyDown(document, { key: 'Escape' });
const locked = () => document.body.style.overflow === 'hidden';

const tab = (options = {}) => {
  const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true, ...options });
  document.activeElement.dispatchEvent(event);
  return event;
};

// A page with an opener and the overlay under test; `build(open, close)` makes the overlay.
const Page = ({ build }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open</button>
      {build(open, () => setOpen(false))}
    </>
  );
};

const inner = <button type="button">Inner</button>;

// Each modal overlay, how to find its dialog, and how a user closes it.
const MODALS = [
  {
    name: 'Modal (standalone)',
    role: 'dialog',
    build: (open, close) => <Modal show={open} title="Title" onClose={close}>{inner}</Modal>,
    close: escape
  },
  {
    name: 'Modal (container)',
    role: 'dialog',
    build: (open, close) => <Modal show={open} onHide={close}>{inner}</Modal>,
    close: escape
  },
  {
    name: 'ModalDialog',
    role: 'dialog',
    build: (open, close) => <ModalDialog isOpen={open} title="Title" onCancel={close}>{inner}</ModalDialog>,
    close: escape
  },
  {
    name: 'Dialog',
    role: 'dialog',
    build: (open, close) => <Dialog isOpen={open} title="Title" handleClose={close}>{inner}</Dialog>,
    close: () => fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  },
  {
    name: 'PopOver',
    role: 'dialog',
    build: (open, close) => <PopOver open={open} handleClose={close}>{inner}</PopOver>,
    close: escape
  },
  {
    name: 'Alert',
    role: 'alertdialog',
    build: (open, close) => (open ? <Alert title="Sure?" onCancel={close} onConfirm={close} /> : null),
    close: escape
  }
];

afterEach(() => {
  document.body.removeAttribute('style');
});

describe.each(MODALS)('$name', ({ role, build, close }) => {
  const open = () => {
    render(<Page build={build} />);
    const opener = screen.getByRole('button', { name: 'Open' });
    opener.focus();
    fireEvent.click(opener);
    return opener;
  };

  it('stops the page behind it scrolling while open, and lets it scroll again after', () => {
    expect(locked()).toBe(false);
    open();
    expect(locked()).toBe(true);
    close();
    expect(locked()).toBe(false);
  });

  it('says it is modal', () => {
    open();
    expect(screen.getByRole(role)).toHaveAttribute('aria-modal', 'true');
  });

  it('moves focus inside', () => {
    open();
    expect(screen.getByRole(role)).toContainElement(document.activeElement);
  });

  it('keeps Tab inside, wrapping at both ends', () => {
    open();
    const dialog = screen.getByRole(role);
    const focusable = within(dialog).getAllByRole('button');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    last.focus();
    tab();
    expect(first).toHaveFocus();

    tab({ shiftKey: true });
    expect(last).toHaveFocus();
  });

  it('gives focus back to the control that opened it', () => {
    const opener = open();
    close();
    expect(opener).toHaveFocus();
  });
});

describe('in the page flow, nothing is locked or trapped', () => {
  it('ModalDialog with inlineMode', () => {
    render(<ModalDialog isOpen inlineMode title="Title">Body</ModalDialog>);
    expect(locked()).toBe(false);
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-modal');
  });

  it('Dialog with inlineMode', () => {
    render(<Dialog isOpen inlineMode title="Title">Body</Dialog>);
    expect(locked()).toBe(false);
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-modal');
  });

  it('Modal with modal={false}', () => {
    render(<Modal show title="Title" onClose={() => {}} modal={false}>Body</Modal>);
    expect(locked()).toBe(false);
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-modal');
  });

  it('a PopOver kept in place (fullSize={false}) is a light-dismiss layer, not modal', () => {
    render(<PopOver open fullSize={false} handleClose={() => {}}>{inner}</PopOver>);
    expect(locked()).toBe(false);
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-modal');
  });

  it('a PopOver kept in place can be made modal', () => {
    render(<PopOver open fullSize={false} modal handleClose={() => {}}>{inner}</PopOver>);
    expect(locked()).toBe(true);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('a closed overlay does not lock the page', () => {
    render(<><Modal show={false} title="T" onClose={() => {}} /><PopOver open={false} /><Dialog isOpen={false} /></>);
    expect(locked()).toBe(false);
  });
});

describe('Overlay', () => {
  it('stops the page scrolling while it shows', () => {
    const { rerender, unmount } = render(<Overlay showing />);
    expect(locked()).toBe(true);
    rerender(<Overlay showing={false} />);
    expect(locked()).toBe(false);
    rerender(<Overlay showing />);
    expect(locked()).toBe(true);
    unmount();
    expect(locked()).toBe(false);
  });
});

describe('two overlays at once', () => {
  it('keep the page locked until both are closed', () => {
    const { rerender } = render(<><Modal show title="A" onClose={() => {}} /><PopOver open handleClose={() => {}} /></>);
    expect(locked()).toBe(true);
    rerender(<><Modal show title="A" onClose={() => {}} /><PopOver open={false} handleClose={() => {}} /></>);
    expect(locked()).toBe(true);
    rerender(<><Modal show={false} title="A" onClose={() => {}} /><PopOver open={false} handleClose={() => {}} /></>);
    expect(locked()).toBe(false);
  });

  it('Tab stays in the one on top', () => {
    const { rerender } = render(<Modal show title="A" onClose={() => {}}><button type="button">A button</button></Modal>);
    expect(screen.getByRole('button', { name: 'A button' })).toBeInTheDocument();
    rerender(
      <>
        <Modal show title="A" onClose={() => {}}><button type="button">A button</button></Modal>
        <PopOver open handleClose={() => {}}><button type="button">B button</button></PopOver>
      </>
    );
    expect(screen.getByRole('button', { name: 'B button' })).toHaveFocus();
    tab();
    expect(screen.getByRole('button', { name: 'B button' })).toHaveFocus();
  });
});

describe('Alert focus', () => {
  it('puts the cursor in a prompt\'s input, not on a button', () => {
    render(<Alert title="Name?" type="input" />);
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('starts on Cancel otherwise, so a stray Enter on the button never confirms', () => {
    render(<Alert title="Sure?" />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  });
});
