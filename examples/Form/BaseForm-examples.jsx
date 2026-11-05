import { useState } from 'react';

import Button from '../../components/Button/Button';
import Checkbox from '../../components/Checkbox/Checkbox';
import TextField from '../../components/TextField/TextField';
import { BaseForm, BaseInput, FormRow } from '../../components/Form';

const LOGIN_FIELDS = [
  { fieldName: 'username', inputType: 'text', displayName: 'Username' },
  { fieldName: 'password', inputType: 'password', displayName: 'Password' }
];

const SIGNUP_FIELDS = [
  { fieldName: 'name', inputType: 'text', displayName: 'Full name' },
  { fieldName: 'email', inputType: 'email', displayName: 'Email' },
  { fieldName: 'password', inputType: 'password', displayName: 'Password' }
];

// There is no server behind these examples: a submit is a real POST to the
// styleguide's own origin, so what you see is the form's error handling.
const FormWithResult = (props) => {
  const [result, setResult] = useState('Not submitted yet.');

  return (
    <div className="example-stack">
      <BaseForm
        action="/example/login"
        onSubmit={() => setResult('Submitting...')}
        handle200={() => setResult('The server accepted the form (200).')}
        handle201={() => setResult('The server created a record (201).')}
        handle400={(response, body) => setResult(`The server rejected the form (400): ${JSON.stringify(body)}`)}
        handle404={() => setResult('The server has no such page (404).')}
        {...props}
      />
      <p>{result}</p>
    </div>
  );
};

const ExternalSubmit = () => {
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <div className="example-stack">
      <BaseForm
        action="/example/subscribe"
        fields={[{ fieldName: 'email', inputType: 'email', displayName: 'Email' }]}
        showSubmit={false}
        shouldSubmit={shouldSubmit}
        onSubmit={() => { setShouldSubmit(false); setCount((n) => n + 1); }}
      />
      <Button variant="primary" onClick={() => setShouldSubmit(true)}>Subscribe</Button>
      <p>Submitted {count} {count === 1 ? 'time' : 'times'}.</p>
    </div>
  );
};

export default {
  name: 'BaseForm',
  description: 'A form that posts its fields to an action URL and shows the server\'s errors. Describe the inputs with fields, and react to the response with handle200, handle201, handle400 and handle404. BaseInput and FormRow are its building blocks.',
  examples: [
    {
      name: 'Login form',
      code: `<BaseForm
  action="/example/login"
  fields={[
    { fieldName: 'username', inputType: 'text', displayName: 'Username' },
    { fieldName: 'password', inputType: 'password', displayName: 'Password' },
  ]}
  submitValue="Log In"
  handle200={(response) => goHome()}
  handle400={(response, body) => showErrors(body)}
/>`,
      output: <FormWithResult fields={LOGIN_FIELDS} submitValue="Log In" />
    },
    {
      name: 'Centered fields and extra content',
      code: `<BaseForm
  action="/example/signup"
  fields={signupFields}
  centered
  submitValue="Create account"
  submittingValue="Creating..."
>
  <Checkbox name="terms" label="I agree to the terms" />
</BaseForm>`,
      output: (
        <FormWithResult action="/example/signup" fields={SIGNUP_FIELDS} centered submitValue="Create account" submittingValue="Creating...">
          <Checkbox name="terms" label="I agree to the terms" />
        </FormWithResult>
      )
    },
    {
      name: 'Submitted from outside the form',
      code: `const [shouldSubmit, setShouldSubmit] = useState(false);

<BaseForm
  action="/example/subscribe"
  fields={[{ fieldName: 'email', inputType: 'email', displayName: 'Email' }]}
  showSubmit={false}
  shouldSubmit={shouldSubmit}
  onSubmit={() => setShouldSubmit(false)}
/>
<Button variant="primary" onClick={() => setShouldSubmit(true)}>Subscribe</Button>`,
      output: <ExternalSubmit />
    },
    {
      name: 'Standalone BaseInput',
      code: '<BaseInput inputType="email" fieldName="email" displayName="Email address" />',
      output: <BaseInput inputType="email" fieldName="email" displayName="Email address" />
    },
    {
      name: 'FormRow with details, help and an error',
      code: `<FormRow label="Display name" optionalText="Optional" helperText="Shown on your public profile.">
  <TextField name="displayName" aria-label="Display name" />
</FormRow>
<FormRow label="Username" showError errors={['That username is already taken.']}>
  <TextField name="username" aria-label="Username" defaultValue="alex" />
</FormRow>`,
      output: (
        <div>
          <FormRow label="Display name" optionalText="Optional" helperText="Shown on your public profile.">
            <TextField name="displayName" aria-label="Display name" />
          </FormRow>
          <FormRow label="Username" showError errors={['That username is already taken.']}>
            <TextField name="username" aria-label="Username" defaultValue="alex" />
          </FormRow>
        </div>
      )
    }
  ]
};
