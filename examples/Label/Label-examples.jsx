import { useState } from 'react';

import Label from '../../components/Label/Label';
import NativeSelect from '../../components/NativeSelect/NativeSelect';
import TextBox from '../../components/TextBox/TextBox';

const PLANS = [
  { label: 'Free', value: 'free' },
  { label: 'Team', value: 'team' },
  { label: 'Enterprise', value: 'enterprise' }
];

const EmailField = () => {
  const [email, setEmail] = useState('');
  return (
    <Label text="Email address">
      <TextBox name="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
    </Label>
  );
};

const PlanSelect = () => {
  const [plan, setPlan] = useState('team');
  return (
    <Label text="Plan">
      <NativeSelect name="plan" options={PLANS} value={plan} onChange={(e) => setPlan(e.target.value)} />
    </Label>
  );
};

const NicknameField = () => {
  const [nickname, setNickname] = useState('');
  return (
    <Label>
      Nickname
      <TextBox name="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
    </Label>
  );
};

export default {
  name: 'Label',
  description: 'Wraps a form control in a native label so clicking the caption focuses the control. Pass text for a caption above the control, or put the caption in the children yourself.',
  examples: [
    {
      name: 'Caption above a text field',
      code: `<Label text="Email address">
  <TextBox name="email" type="email" placeholder="you@example.com" value={email} onChange={handleChange} />
</Label>`,
      output: <EmailField />
    },
    {
      name: 'Caption above a select',
      code: `<Label text="Plan">
  <NativeSelect name="plan" options={plans} value={plan} onChange={handleChange} />
</Label>`,
      output: <PlanSelect />
    },
    {
      name: 'Caption inside the children',
      code: `<Label>
  Nickname
  <TextBox name="nickname" value={nickname} onChange={handleChange} />
</Label>`,
      output: <NicknameField />
    },
    {
      name: 'Text only',
      code: '<Label text="Notification settings" />',
      output: <Label text="Notification settings" />
    }
  ]
};
