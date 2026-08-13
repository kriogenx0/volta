import { useState } from 'react';

import Field from '../../components/Field/Field';
import TextField from '../../components/TextField/TextField';
import Select from '../../components/Select/Select';
import Textarea from '../../components/Textarea/Textarea';
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
    <form style={{ maxWidth: 440 }} onSubmit={(event) => event.preventDefault()}>
      <Field label="Name">
        <TextField name="name" defaultValue="Alex Morgan" />
      </Field>
      <Field label="Role">
        <Select
          name="role"
          options={roles}
          value={role}
          onChange={(event) => setRole(event.target.value)}
        />
      </Field>
      <Field label="Bio">
        <Textarea name="bio" rows={3} resize="y" placeholder="A short introduction" />
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
  description: 'A layout wrapper that pairs a label with any form control.',
  examples: [
    {
      name: 'Field with label',
      code: `<Field label="Username">
  <TextField placeholder="Enter username" />
</Field>`,
      output: (
        <Field label="Username">
          <TextField placeholder="Enter username" />
        </Field>
      )
    },
    {
      name: 'Complete profile form',
      code: `<form>
  <Field label="Name">
    <TextField name="name" defaultValue="Alex Morgan" />
  </Field>
  <Field label="Role">
    <Select name="role" options={roles} />
  </Field>
  <Field label="Bio">
    <Textarea name="bio" rows={3} resize="y" />
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
  <Select name="role" options={roles} defaultValue="engineering" />
</Field>`,
      output: (
        <Field label="Team role">
          <Select name="role" options={roles} defaultValue="engineering" />
        </Field>
      )
    },
    {
      name: 'Multiline field',
      code: `<Field label="Project notes">
  <Textarea rows={4} resize="y" placeholder="Add context for your team…" />
</Field>`,
      output: (
        <Field label="Project notes">
          <Textarea rows={4} resize="y" placeholder="Add context for your team…" />
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
