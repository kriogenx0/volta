import Field from './Field';
import TextField from '../TextField';

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
      name: 'Stacked field',
      code: `<Field label="Email" stack>
  <TextField placeholder="you@example.com" />
</Field>`,
      output: (
        <Field label="Email" stack>
          <TextField placeholder="you@example.com" />
        </Field>
      )
    },
  ]
};
