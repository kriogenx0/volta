import { useState } from 'react';

import Button from '../../components/Button';
import CloseButton from '../../components/CloseButton';

const DismissibleNotice = () => {
  const [open, setOpen] = useState(true);
  if (!open) return <Button onClick={() => setOpen(true)}>Show the notice again</Button>;
  return (
    <div className="example-stack">
      <p>Your changes were saved.</p>
      <CloseButton aria-label="Dismiss notice" onClick={() => setOpen(false)} />
    </div>
  );
};

export default {
  name: 'CloseButton',
  description: 'A minimal x button for dismissing dialogs, panels, and notifications. It shows only an icon, so it is labelled "Close" for assistive tech unless you pass your own aria-label. size="sm" is the compact version for a dialog header, next to a title; the default is the large one. Other props go to the underlying Button.',
  examples: [
    {
      name: 'Close button',
      code: '<CloseButton onClick={() => setOpen(false)} />',
      output: <CloseButton onClick={() => {}} />
    },
    {
      name: 'Dismissing a notice',
      code: `const [open, setOpen] = useState(true);

{open && (
  <div>
    <p>Your changes were saved.</p>
    <CloseButton aria-label="Dismiss notice" onClick={() => setOpen(false)} />
  </div>
)}`,
      output: <DismissibleNotice />
    },
    {
      name: 'Small, for a dialog header',
      code: '<CloseButton size="sm" aria-label="Close dialog" onClick={close} />',
      output: <CloseButton size="sm" aria-label="Close dialog" onClick={() => {}} />
    },
    {
      name: 'Disabled',
      code: '<CloseButton disabled />',
      output: <CloseButton disabled />
    }
  ]
};
