import { useState } from 'react';

import TextField, { TextBox } from '../../components/TextField/TextField';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// validate(value) runs on every key up, so the message follows what was typed.
const ValidatedEmail = () => {
  const [error, setError] = useState();
  const validate = (value) => setError(!value || EMAIL_PATTERN.test(value) ? undefined : 'Enter a valid email address');

  return <TextField label="Email" type="email" placeholder="you@example.com" validate={validate} error={error} />;
};

export default {
  name: 'TextField',
  description: 'Single or multi line text input with an optional label, size and error message. Any other prop (value, onChange, placeholder, type, ...) goes to the native input. TextBox is an alias that also adds the c-text_box wrapper class.',
  examples: [
    {
      name: 'TextField',
      code: '<TextField placeholder="Enter stuff here" />',
      output: <TextField placeholder="Enter stuff here" />
    },
    {
      name: 'With a label, and an optional one',
      code: `<TextField label="Full name" placeholder="Ada Lovelace" />
<TextField label="Nickname" optional />`,
      output: (
        <div className="example-stack">
          <TextField label="Full name" placeholder="Ada Lovelace" />
          <TextField label="Nickname" optional />
        </div>
      )
    },
    {
      name: 'Sizes',
      code: `<TextField fieldSize="sm" defaultValue="Small (default)" />
<TextField fieldSize="md" defaultValue="Medium" />`,
      output: (
        <div className="example-stack">
          <TextField fieldSize="sm" defaultValue="Small (default)" />
          <TextField fieldSize="md" defaultValue="Medium" />
        </div>
      )
    },
    {
      name: 'With a label and a hint',
      code: '<TextField label="Email" hint="Use your work address" type="email" />',
      output: <TextField label="Email" hint="Use your work address" type="email" />
    },
    {
      name: 'Disabled',
      code: '<TextField disabled defaultValue="Can\'t edit this" />',
      output: <TextField disabled defaultValue="Can't edit this" />
    },
    {
      name: 'With an error message',
      code: `<TextField
  label="Username"
  defaultValue="ab"
  error="Usernames need at least 3 characters"
/>`,
      output: <TextField label="Username" defaultValue="ab" error="Usernames need at least 3 characters" />
    },
    {
      name: 'Validated as you type',
      code: `const [error, setError] = useState();
const validate = (value) =>
  setError(!value || EMAIL_PATTERN.test(value) ? undefined : 'Enter a valid email address');

<TextField
  label="Email"
  type="email"
  placeholder="you@example.com"
  validate={validate}
  error={error}
/>`,
      output: <ValidatedEmail />
    },
    {
      name: 'Multi line text field similar to a textarea',
      code: '<TextField multiline defaultValue="This is a really long paragraph that someone wrote into this textfield." />',
      output: <TextField multiline defaultValue="This is a really long paragraph that someone wrote into this textfield." />
    },
    {
      name: 'TextBox (alias)',
      code: '<TextBox placeholder="Same as TextField" />',
      output: <TextBox placeholder="Same as TextField" />
    }
  ]
};
