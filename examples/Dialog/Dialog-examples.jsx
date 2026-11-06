import { useState } from 'react';

import Button from '../../components/Button/Button';
import Dialog from '../../components/Dialog/Dialog';
import TextField from '../../components/TextField/TextField';

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
      <TextField label="Tag name" value={name} onChange={(e) => setName(e.target.value)} />
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

export default {
  name: 'Dialog',
  description: 'A popover with a title, a body and Save / Cancel buttons. isOpen opens it. Save calls handleSave; Cancel and the header close button call handleClose; each also closes the dialog, so reset your own open state in those callbacks. While open it locks page scroll and keeps Tab inside, then returns focus to the control that opened it; with inlineMode it sits in the page and does neither.',
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
  <TextField label="Tag name" value={name} onChange={(e) => setName(e.target.value)} />
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
    }
  ]
};
