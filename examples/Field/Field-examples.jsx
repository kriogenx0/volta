import { useState } from 'react';

import Field from '../../components/Field/Field';
import TextBox from '../../components/TextBox/TextBox';
import NativeSelect from '../../components/NativeSelect/NativeSelect';
import Checkbox from '../../components/Checkbox/Checkbox';
import Toggle from '../../components/Toggle/Toggle';

const roles = [
  { label: 'Designer', value: 'design' },
  { label: 'Engineer', value: 'engineering' },
  { label: 'Product manager', value: 'product' },
];

const ProfileForm = () => {
  const [role, setRole] = useState('design');
  const [updates, setUpdates] = useState(true);

  return (
    <form className="example-narrow" onSubmit={(event) => event.preventDefault()}>
      <Field label="Name">
        <TextBox name="name" defaultValue="Alex Morgan" />
      </Field>
      <Field label="Role">
        <NativeSelect
          name="role"
          options={roles}
          value={role}
          onChange={(event) => setRole(event.target.value)}
        />
      </Field>
      <Field label="Bio">
        <TextBox multiline name="bio" rows={3} resize="y" placeholder="A short introduction" />
      </Field>
      <Field>
        <Checkbox
          label="Send me product updates"
          checked={updates}
          onChange={(event) => setUpdates(event.target.checked)}
        />
      </Field>
    </form>
  );
};

const NotificationField = () => {
  const [enabled, setEnabled] = useState(true);

  return (
    <Field label="Email notifications" type="split">
      <Toggle
        name="emailNotifications"
        checked={enabled}
        onChange={(event) => setEnabled(event.target.checked)}
      />
    </Field>
  );
};

export default {
  name: 'Field',
  description: 'A layout wrapper that pairs a label with a form control, and connects them for assistive technology: the label points at the control, an optional hint and error are read as its description, and an error marks it invalid. With several controls inside, the label names the group instead. A control with its own id keeps it.',
  examples: [
    {
      name: 'Field with label',
      code: `<Field label="Username">
  <TextBox placeholder="Enter username" />
</Field>`,
      output: (
        <Field label="Username">
          <TextBox placeholder="Enter username" />
        </Field>
      )
    },
    {
      name: 'Complete profile form',
      code: `<form>
  <Field label="Name">
    <TextBox name="name" defaultValue="Alex Morgan" />
  </Field>
  <Field label="Role">
    <NativeSelect name="role" options={roles} />
  </Field>
  <Field label="Bio">
    <TextBox multiline name="bio" rows={3} resize="y" />
  </Field>
  <Field>
    <Checkbox label="Send me product updates" />
  </Field>
</form>`,
      output: <ProfileForm />
    },
    {
      name: 'Select field',
      code: `<Field label="Team role">
  <NativeSelect name="role" options={roles} defaultValue="engineering" />
</Field>`,
      output: (
        <Field label="Team role">
          <NativeSelect name="role" options={roles} defaultValue="engineering" />
        </Field>
      )
    },
    {
      name: 'Multiline field',
      code: `<Field label="Project notes">
  <TextBox multiline rows={4} resize="y" placeholder="Add context for your team…" />
</Field>`,
      output: (
        <Field label="Project notes">
          <TextBox multiline rows={4} resize="y" placeholder="Add context for your team…" />
        </Field>
      )
    },
    {
      name: 'Split label and control',
      code: `<Field label="Email notifications" type="split">
  <Toggle checked={enabled} onChange={handleChange} />
</Field>`,
      output: <NotificationField />
    },
    {
      name: 'Hint and error',
      code: `<Field label="Email" hint="Use your work address">
  <TextBox type="email" />
</Field>
<Field label="Email" error="That doesn't look like an email address">
  <TextBox type="email" defaultValue="alex@" />
</Field>`,
      output: (
        <>
          <Field label="Email" hint="Use your work address">
            <TextBox type="email" />
          </Field>
          <Field label="Email" error="That doesn't look like an email address">
            <TextBox type="email" defaultValue="alex@" />
          </Field>
        </>
      )
    },
    {
      name: 'Several controls as a group',
      code: `<Field label="Date of birth" hint="As on your passport">
  <TextBox aria-label="Day" />
  <TextBox aria-label="Month" />
  <TextBox aria-label="Year" />
</Field>`,
      output: (
        <Field label="Date of birth" hint="As on your passport">
          <TextBox aria-label="Day" />
          <TextBox aria-label="Month" />
          <TextBox aria-label="Year" />
        </Field>
      )
    },
    {
      name: 'Field without a label',
      code: `<Field>
  <Checkbox label="I agree to the terms" />
</Field>`,
      output: (
        <Field>
          <Checkbox label="I agree to the terms" />
        </Field>
      )
    },
  ]
};
