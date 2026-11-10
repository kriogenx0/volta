import { useState } from 'react';

import Button from '../../components/Button/Button';
import Dialog, { ModalDialog } from '../../components/Dialog/Dialog';
import TextBox from '../../components/TextBox/TextBox';

// A button that opens a Dialog, plus a line saying what the user did. Save and
// Close close the dialog themselves, so the parent's open state is reset in both
// callbacks, which lets the button open it again.
const Demo = ({ buttonLabel = 'Open dialog', children, ...dialogProps }) => {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState('none yet');
  return (
    <div className="example-stack">
      <div>
        <Button onClick={() => setOpen(true)}>{buttonLabel}</Button>
      </div>
      <p>Last action: {lastAction}</p>
      <Dialog
        isOpen={open}
        handleSave={() => { setOpen(false); setLastAction('Saved'); }}
        handleClose={() => { setOpen(false); setLastAction('Closed'); }}
        {...dialogProps}
      >
        {children}
      </Dialog>
    </div>
  );
};

const NeedsName = () => {
  const [name, setName] = useState('');
  return (
    <Demo title="Add tag" titleSave="Add" saveEnabled={name.trim() !== ''}>
      <TextBox label="Tag name" value={name} onChange={(e) => setName(e.target.value)} />
    </Demo>
  );
};

// Remounting (key) puts the dialog back to its initial, open state
const InlineDemo = () => {
  const [round, setRound] = useState(0);
  return (
    <div className="example-stack">
      <div>
        <Button onClick={() => setRound((n) => n + 1)}>Show again</Button>
      </div>
      <Dialog key={round} isOpen inlineMode title="Shown in the page">
        <p>Inline mode keeps the dialog in the page flow instead of floating over it.</p>
      </Dialog>
    </div>
  );
};

// A button that opens a ModalDialog, plus a line saying what the user did.
// OK and Cancel close the dialog themselves; the parent's open state is reset
// in the callbacks so the button can open it again.
const ModalDemo = ({ buttonLabel = 'Open dialog', children, ...dialogProps }) => {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState('none yet');
  return (
    <div className="example-stack">
      <div>
        <Button onClick={() => setOpen(true)}>{buttonLabel}</Button>
      </div>
      <p>Last action: {lastAction}</p>
      <ModalDialog
        isOpen={open}
        onOkay={() => { setOpen(false); setLastAction('OK'); }}
        onCancel={() => { setOpen(false); setLastAction('Cancel'); }}
        {...dialogProps}
      >
        {children}
      </ModalDialog>
    </div>
  );
};

const ModalNeedsName = () => {
  const [name, setName] = useState('');
  return (
    <ModalDemo title="New folder" okayButtonLabel="Create" okayEnabled={name.trim() !== ''}>
      <TextBox label="Folder name" value={name} onChange={(e) => setName(e.target.value)} />
    </ModalDemo>
  );
};

// Remounting (key) puts the dialog back to its initial, open state
const ModalInlineDemo = () => {
  const [round, setRound] = useState(0);
  return (
    <div className="example-stack">
      <div>
        <Button onClick={() => setRound((n) => n + 1)}>Show again</Button>
      </div>
      <ModalDialog key={round} isOpen inlineMode title="Shown in the page" okayButtonLabel="Apply">
        <p>Inline mode keeps the dialog in the page flow instead of floating over it.</p>
      </ModalDialog>
    </div>
  );
};

export default {
  name: 'Dialog',
  description: 'A Modal with a title, a body and Save / Cancel buttons. variant="confirmation" is a short question with Confirm / Cancel. ModalDialog is the same dialog with OK / Cancel names. isOpen opens it. Save calls handleSave; Cancel and the header close button call handleClose; each also closes the dialog, so reset your own open state in those callbacks. While open it locks page scroll and keeps Tab inside, then returns focus to the control that opened it; with inlineMode it sits in the page and does neither.',
  examples: [
    {
      name: 'Title, Save and Cancel',
      code: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open dialog</Button>
<Dialog
  isOpen={open}
  title="Edit profile"
  handleSave={() => setOpen(false)}
  handleClose={() => setOpen(false)}
>
  <p>Dialog body.</p>
</Dialog>`,
      output: <Demo title="Edit profile"><p>Dialog body.</p></Demo>
    },
    {
      name: 'Save disabled until valid',
      code: `<Dialog
  isOpen={open}
  title="Add tag"
  titleSave="Add"
  saveEnabled={name.trim() !== ''}
  handleSave={add}
  handleClose={close}
>
  <TextBox label="Tag name" value={name} onChange={(e) => setName(e.target.value)} />
</Dialog>`,
      output: <NeedsName />
    },
    {
      name: 'Close on overlay click',
      code: `<Dialog isOpen={open} title="Quick note" closeOnOverlayClick handleClose={close}>
  <p>Click outside the dialog or press Escape to close it.</p>
</Dialog>`,
      output: <Demo title="Quick note" closeOnOverlayClick><p>Click outside the dialog or press Escape to close it.</p></Demo>
    },
    {
      name: 'Custom labels, no header',
      code: `<Dialog
  isOpen={open}
  hideHeader
  titleSave="Delete"
  titleCancel="Keep"
  handleSave={remove}
  handleClose={close}
>
  <p>Delete this report?</p>
</Dialog>`,
      output: <Demo hideHeader titleSave="Delete" titleCancel="Keep"><p>Delete this report?</p></Demo>
    },
    {
      name: 'Without a Save button',
      code: `<Dialog isOpen={open} title="About" hideSaveButton titleCancel="Close" handleClose={close}>
  <p>Read-only information.</p>
</Dialog>`,
      output: <Demo title="About" hideSaveButton titleCancel="Close"><p>Read-only information.</p></Demo>
    },
    {
      name: 'Inline mode',
      code: `<Dialog isOpen inlineMode title="Shown in the page">
  <p>Inline mode keeps the dialog in the page flow instead of floating over it.</p>
</Dialog>`,
      output: <InlineDemo />
    },
    {
      name: 'A confirmation',
      code: `<Dialog
  isOpen={open}
  variant="confirmation"
  title="Discard changes?"
  titleSave="Discard"
  titleCancel="Keep editing"
  handleSave={discard}
  handleClose={close}
>
  <p>Your edits will be lost.</p>
</Dialog>`,
      output: <Demo variant="confirmation" title="Discard changes?" titleSave="Discard" titleCancel="Keep editing"><p>Your edits will be lost.</p></Demo>
    },
    {
      name: 'A destructive confirmation',
      code: `<Dialog isOpen={open} variant="confirmation" danger title="Delete project?" titleSave="Delete" handleSave={remove} handleClose={close}>
  <p>This can't be undone.</p>
</Dialog>`,
      output: <Demo variant="confirmation" danger title="Delete project?" titleSave="Delete"><p>This can't be undone.</p></Demo>
    },
    {
      name: 'OK and Cancel',
      code: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open dialog</Button>
<ModalDialog
  isOpen={open}
  title="Confirm"
  onOkay={() => setOpen(false)}
  onCancel={() => setOpen(false)}
>
  <p>Apply these changes?</p>
</ModalDialog>`,
      output: <ModalDemo title="Confirm"><p>Apply these changes?</p></ModalDemo>
    },
    {
      name: 'Title with a close X',
      code: `<ModalDialog isOpen={open} title="Details" closeX onOkay={close} onCancel={close}>
  <p>The X in the header cancels, like the Cancel button.</p>
</ModalDialog>`,
      output: <ModalDemo title="Details" closeX><p>The X in the header cancels, like the Cancel button.</p></ModalDemo>
    },
    {
      name: 'OK disabled until valid',
      code: `<ModalDialog
  isOpen={open}
  title="New folder"
  okayButtonLabel="Create"
  okayEnabled={name.trim() !== ''}
  onOkay={create}
  onCancel={close}
>
  <TextBox label="Folder name" value={name} onChange={(e) => setName(e.target.value)} />
</ModalDialog>`,
      output: <ModalNeedsName />
    },
    {
      name: 'Only the buttons close it',
      code: `<ModalDialog
  isOpen={open}
  title="Heads up"
  closeOnOverlayClick={false}
  hideOkayButton
  cancelButtonLabel="Got it"
  onCancel={close}
>
  <p>The backdrop and Escape don't dismiss this one.</p>
</ModalDialog>`,
      output: (
        <ModalDemo title="Heads up" closeOnOverlayClick={false} hideOkayButton cancelButtonLabel="Got it">
          <p>The backdrop and Escape don't dismiss this one.</p>
        </ModalDemo>
      )
    },
    {
      name: 'Inline mode with OK and Cancel',
      code: `<ModalDialog isOpen inlineMode title="Shown in the page" okayButtonLabel="Apply">
  <p>Inline mode keeps the dialog in the page flow instead of floating over it.</p>
</ModalDialog>`,
      output: <ModalInlineDemo />
    }
  ]
};
