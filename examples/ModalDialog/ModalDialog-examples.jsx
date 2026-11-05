import { useState } from 'react';

import Button from '../../components/Button/Button';
import ModalDialog from '../../components/ModalDialog/ModalDialog';
import TextField from '../../components/TextField/TextField';

// A button that opens a ModalDialog, plus a line saying what the user did.
// OK and Cancel close the dialog themselves; the parent's open state is reset
// in the callbacks so the button can open it again.
const Demo = ({ buttonLabel = 'Open dialog', children, ...dialogProps }) => {
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

const NeedsName = () => {
  const [name, setName] = useState('');
  return (
    <Demo title="New folder" okayButtonLabel="Create" okayEnabled={name.trim() !== ''}>
      <TextField label="Folder name" value={name} onChange={(e) => setName(e.target.value)} />
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
      <ModalDialog key={round} isOpen inlineMode title="Shown in the page" okayButtonLabel="Apply">
        <p>Inline mode keeps the dialog in the page flow instead of floating over it.</p>
      </ModalDialog>
    </div>
  );
};

export default {
  name: 'ModalDialog',
  description: 'A modal with an optional title, a body and OK / Cancel buttons. isOpen opens it; OK and Cancel (and the X, and a click on the backdrop or Escape) call onOkay / onCancel and close it, so reset your own open state in those callbacks.',
  examples: [
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
      output: <Demo title="Confirm"><p>Apply these changes?</p></Demo>
    },
    {
      name: 'Title with a close X',
      code: `<ModalDialog isOpen={open} title="Details" closeX onOkay={close} onCancel={close}>
  <p>The X in the header cancels, like the Cancel button.</p>
</ModalDialog>`,
      output: <Demo title="Details" closeX><p>The X in the header cancels, like the Cancel button.</p></Demo>
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
  <TextField label="Folder name" value={name} onChange={(e) => setName(e.target.value)} />
</ModalDialog>`,
      output: <NeedsName />
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
        <Demo title="Heads up" closeOnOverlayClick={false} hideOkayButton cancelButtonLabel="Got it">
          <p>The backdrop and Escape don't dismiss this one.</p>
        </Demo>
      )
    },
    {
      name: 'Inline mode',
      code: `<ModalDialog isOpen inlineMode title="Shown in the page" okayButtonLabel="Apply">
  <p>Inline mode keeps the dialog in the page flow instead of floating over it.</p>
</ModalDialog>`,
      output: <InlineDemo />
    }
  ]
};
