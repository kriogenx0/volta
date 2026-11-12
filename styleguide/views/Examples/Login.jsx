import { useState } from 'react';

import { Button, Checkbox, Link, TextBox } from '../../../components';

import Logo from '../Logo';

// A sign-in form: email, password, remember me and a link to reset.
// `onOpen(key)` jumps to another example page, as the sign-up link does.
const Login = ({ onOpen }) => {
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get('password')) {
      setError('Enter your password.');
      return;
    }
    setError('');
    setSignedIn(true);
  };

  return (
    <form className="sample-auth" onSubmit={handleSubmit} noValidate>
      <Logo size={44} />
      <h2>Welcome back</h2>
      <p className="sample-muted">Sign in to your account to continue.</p>
      <TextBox label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
      <TextBox label="Password" name="password" type="password" autoComplete="current-password" error={error} />
      <div className="sample-row sample-row--between">
        <Checkbox label="Keep me signed in" defaultChecked />
        <Link to="#forgot" onClick={(event) => event.preventDefault()}>Forgot password?</Link>
      </div>
      <Button variant="primary" type="submit">Sign in</Button>
      {signedIn && <p className="sample-note" role="status">Signed in (this is only an example).</p>}
      <p className="sample-muted sample-center">New here? <Link to="#signup" onClick={(event) => { event.preventDefault(); if (onOpen) onOpen('signup'); }}>Create an account</Link></p>
    </form>
  );
};

export default Login;
