import { useState } from 'react';

import Button from '../../components/Button/Button';
import Alert from '../../components/ModalAlert';

// A button that shows an Alert, plus a line saying what the user answered. The
// Alert is shown while it is rendered, so it is rendered only while `open`.
const Demo = ({ buttonLabel, describe, ...alertProps }) => {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState('nothing yet');
  const answer = (text) => {
    setResult(text);
    setOpen(false);
  };
  return (
    <div className="example-stack">
      <div>
        <Button onClick={() => setOpen(true)}>{buttonLabel}</Button>
      </div>
      <p>Answer: {result}</p>
      {open && (
        <Alert
          onConfirm={(value) => answer(describe(value))}
          onCancel={() => answer('cancelled')}
          {...alertProps}
        />
      )}
    </div>
  );
};

export default {
  name: 'Alert',
  description: 'A centered confirm or prompt box that covers the page. Render it while it should be shown; Confirm and Cancel call onConfirm and onCancel, Enter confirms and Escape cancels. With type="input" it asks for text and onConfirm receives it. While it is shown it locks page scroll and keeps Tab inside, then returns focus to where it was.',
  examples: [
    {
      name: 'Confirm',
      code: `{open && (
  <Alert
    title="Delete this file?"
    message="This can't be undone."
    confirmTitle="Delete"
    onConfirm={() => setOpen(false)}
    onCancel={() => setOpen(false)}
  />
)}`,
      output: (
        <Demo
          buttonLabel="Delete file"
          title="Delete this file?"
          message="This can't be undone."
          confirmTitle="Delete"
          describe={() => 'confirmed'}
        />
      )
    },
    {
      name: 'Prompt for text',
      code: `{open && (
  <Alert
    type="input"
    title="Rename file"
    message="Enter a new name."
    onConfirm={(value) => rename(value)}
    onCancel={() => setOpen(false)}
  />
)}`,
      output: (
        <Demo
          buttonLabel="Rename file"
          type="input"
          title="Rename file"
          message="Enter a new name."
          describe={(value) => `"${value}"`}
        />
      )
    },
    {
      name: 'Custom button labels',
      code: `<Alert
  title="Unsaved changes"
  message="Leave without saving?"
  confirmTitle="Leave"
  cancelTitle="Stay"
  onConfirm={leave}
  onCancel={stay}
/>`,
      output: (
        <Demo
          buttonLabel="Leave page"
          title="Unsaved changes"
          message="Leave without saving?"
          confirmTitle="Leave"
          cancelTitle="Stay"
          describe={() => 'left'}
        />
      )
    },
    {
      name: 'Title only',
      code: `<Alert title="Session expired" confirmTitle="Sign in" cancelTitle="Later" onConfirm={signIn} onCancel={close} />`,
      output: (
        <Demo
          buttonLabel="Show notice"
          title="Session expired"
          confirmTitle="Sign in"
          cancelTitle="Later"
          describe={() => 'sign in'}
        />
      )
    }
  ]
};
