import { useState } from 'react';

import TextBox from '../../components/TextBox/TextBox';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// validate(value) runs on every key up, so the message follows what was typed.
const ValidatedEmail = () => {
  const [error, setError] = useState();
  const validate = (value) => setError(!value || EMAIL_PATTERN.test(value) ? undefined : 'Enter a valid email address');

  return <TextBox label="Email" type="email" placeholder="you@example.com" validate={validate} error={error} />;
};

const MAX_LENGTH = 140;

const CountedTextBox = () => {
  const [text, setText] = useState('');

  return (
    <div>
      <TextBox
        multiline
        label="Message"
        placeholder="Say something"
        maxLength={MAX_LENGTH}
        rows={3}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <p>{text.length} / {MAX_LENGTH} characters</p>
    </div>
  );
};

export default {
  name: 'TextBox',
  description: 'A single line of text, or a textarea with multiline. Takes a label, hint, error and size, and passes any other prop (value, onChange, placeholder, type, ...) to the native input. multiline adds resize and height. TextField and Textarea are other names for it.',
  examples: [
    {
      name: 'TextBox',
      code: '<TextBox placeholder="Enter stuff here" />',
      output: <TextBox placeholder="Enter stuff here" />
    },
    {
      name: 'With a label, and an optional one',
      code: `<TextBox label="Full name" placeholder="Ada Lovelace" />
<TextBox label="Nickname" optional />`,
      output: (
        <div className="example-stack">
          <TextBox label="Full name" placeholder="Ada Lovelace" />
          <TextBox label="Nickname" optional />
        </div>
      )
    },
    {
      name: 'Sizes',
      code: `<TextBox fieldSize="sm" defaultValue="Small (default)" />
<TextBox fieldSize="md" defaultValue="Medium" />`,
      output: (
        <div className="example-stack">
          <TextBox fieldSize="sm" defaultValue="Small (default)" />
          <TextBox fieldSize="md" defaultValue="Medium" />
        </div>
      )
    },
    {
      name: 'With a label and a hint',
      code: '<TextBox label="Email" hint="Use your work address" type="email" />',
      output: <TextBox label="Email" hint="Use your work address" type="email" />
    },
    {
      name: 'Disabled',
      code: '<TextBox disabled defaultValue="Can\'t edit this" />',
      output: <TextBox disabled defaultValue="Can't edit this" />
    },
    {
      name: 'With an error message',
      code: `<TextBox
  label="Username"
  defaultValue="ab"
  error="Usernames need at least 3 characters"
/>`,
      output: <TextBox label="Username" defaultValue="ab" error="Usernames need at least 3 characters" />
    },
    {
      name: 'Validated as you type',
      code: `const [error, setError] = useState();
const validate = (value) =>
  setError(!value || EMAIL_PATTERN.test(value) ? undefined : 'Enter a valid email address');

<TextBox
  label="Email"
  type="email"
  placeholder="you@example.com"
  validate={validate}
  error={error}
/>`,
      output: <ValidatedEmail />
    },
    {
      name: 'Multiline (textarea)',
      code: '<TextBox multiline placeholder="Write something..." rows={4} />',
      output: <TextBox multiline placeholder="Write something..." rows={4} />
    },
    {
      name: 'Controlled with a character count',
      code: `const [text, setText] = useState('');

<TextBox multiline
  label="Message"
  placeholder="Say something"
  maxLength={140}
  rows={3}
  value={text}
  onChange={(event) => setText(event.target.value)}
/>
<p>{text.length} / 140 characters</p>`,
      output: <CountedTextBox />
    },
    {
      name: 'Resize directions',
      code: `<TextBox multiline resize="both" rows={2} defaultValue="Resizable both ways (default)" />
<TextBox multiline resize="y" rows={2} defaultValue="Resizable up and down" />
<TextBox multiline resize="none" rows={2} defaultValue="Fixed size" />`,
      output: (
        <div className="example-stack">
          <TextBox multiline resize="both" rows={2} defaultValue="Resizable both ways (default)" />
          <TextBox multiline resize="y" rows={2} defaultValue="Resizable up and down" />
          <TextBox multiline resize="none" rows={2} defaultValue="Fixed size" />
        </div>
      )
    },
    {
      name: 'Fixed height',
      code: '<TextBox multiline height={160} resize="none" placeholder="160px tall" />',
      output: <TextBox multiline height={160} resize="none" placeholder="160px tall" />
    },
    {
      name: 'Optional, disabled and error states',
      code: `<TextBox multiline label="Bio" optional rows={2} />
<TextBox multiline label="Locked notes" disabled rows={2} defaultValue="Read only for now" />
<TextBox multiline label="Reason" rows={2} error="A reason is required" />`,
      output: (
        <div className="example-stack">
          <TextBox multiline label="Bio" optional rows={2} />
          <TextBox multiline label="Locked notes" disabled rows={2} defaultValue="Read only for now" />
          <TextBox multiline label="Reason" rows={2} error="A reason is required" />
        </div>
      )
    }
  ]
};
