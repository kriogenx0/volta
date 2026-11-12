import { useState } from 'react';

import { Button, Checkbox, Link, NativeSelect, TextBox } from '../../../components';

import Logo from '../Logo';
import { COUNTRIES } from './examples-data';

// A sign-up form: details, a country and the terms. The button waits for the terms.
// `onOpen(key)` jumps to another example page, as the sign-in link does.
const Signup = ({ onOpen }) => {
  const [agreed, setAgreed] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setDone(true);
  };

  return (
    <form className="sample-auth" onSubmit={handleSubmit} noValidate>
      <Logo size={44} />
      <h2>Create your account</h2>
      <p className="sample-muted">It takes a minute. No card needed.</p>
      <div className="sample-row">
        <TextBox label="First name" name="first" autoComplete="given-name" />
        <TextBox label="Last name" name="last" autoComplete="family-name" />
      </div>
      <TextBox label="Work email" name="email" type="email" autoComplete="email" placeholder="you@company.com" />
      <TextBox label="Password" name="password" type="password" autoComplete="new-password" hint="At least 12 characters." />
      <NativeSelect label="Country" name="country" options={COUNTRIES} defaultValue="us" />
      <Checkbox label="I agree to the terms and the privacy policy" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
      <Button variant="primary" type="submit" disabled={!agreed}>Create account</Button>
      {done && <p className="sample-note" role="status">Account created (this is only an example).</p>}
      <p className="sample-muted sample-center">Already have one? <Link to="#login" onClick={(event) => { event.preventDefault(); if (onOpen) onOpen('login'); }}>Sign in</Link></p>
    </form>
  );
};

export default Signup;
