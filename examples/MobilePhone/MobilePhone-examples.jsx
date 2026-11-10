import { useState } from 'react';

import MobilePhone from '../../components/MobilePhone/MobilePhone';
import Button from '../../components/Button/Button';
import TextBox from '../../components/TextBox/TextBox';
import Toggle from '../../components/Toggle/Toggle';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <MobilePhone>
      <form className="example-stack" onSubmit={(e) => e.preventDefault()}>
        <h2>Sign in</h2>
        <TextBox label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextBox label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" variant="primary" full>Sign in</Button>
      </form>
    </MobilePhone>
  );
};

const SETTINGS = [
  { key: 'push', label: 'Push notifications' },
  { key: 'email', label: 'Email digest' },
  { key: 'sound', label: 'Sounds' }
];

const Settings = () => {
  const [on, setOn] = useState({ push: true, email: false, sound: true });

  return (
    <MobilePhone>
      <div className="example-stack">
        <h2>Settings</h2>
        {SETTINGS.map(({ key, label }) => (
          <div key={key}>
            <Toggle
              name={key}
              aria-label={label}
              checked={on[key]}
              onChange={(e) => setOn({ ...on, [key]: e.target.checked })}
            />
            {' '}{label}
          </div>
        ))}
      </div>
    </MobilePhone>
  );
};

const ROWS = Array.from({ length: 14 }, (_, index) => `Message ${index + 1}`);

export default {
  name: 'MobilePhone',
  description: 'A phone-shaped frame, 320px wide at least 480px tall, with a speaker, a clock in the status bar and a home button. Put a screen of your app inside it as children; the clock shows the current time on a 12-hour clock.',
  examples: [
    {
      name: 'Empty phone',
      code: '<MobilePhone />',
      output: <MobilePhone />
    },
    {
      name: 'Sign-in screen',
      code: `<MobilePhone>
  <form>
    <h2>Sign in</h2>
    <TextBox label="Email" type="email" value={email} onChange={handleEmail} />
    <TextBox label="Password" type="password" value={password} onChange={handlePassword} />
    <Button type="submit" variant="primary" full>Sign in</Button>
  </form>
</MobilePhone>`,
      output: <SignIn />
    },
    {
      name: 'Settings screen with toggles',
      code: `<MobilePhone>
  <h2>Settings</h2>
  {settings.map(({ key, label }) => (
    <div key={key}>
      <Toggle name={key} aria-label={label} checked={on[key]} onChange={handleChange} /> {label}
    </div>
  ))}
</MobilePhone>`,
      output: <Settings />
    },
    {
      name: 'Long content stretches the screen',
      code: `<MobilePhone>
  {messages.map((text) => <p key={text}>{text}</p>)}
</MobilePhone>`,
      output: (
        <MobilePhone>
          {ROWS.map((text) => <p key={text}>{text}</p>)}
        </MobilePhone>
      )
    }
  ]
};
