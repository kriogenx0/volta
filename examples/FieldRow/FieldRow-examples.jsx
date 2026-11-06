import FieldRow from '../../components/FieldRow/FieldRow';
import TextField from '../../components/TextField/TextField';
import Select from '../../components/Select/Select';

export default {
  name: 'FieldRow',
  description: 'A labeled form row with a responsive side-by-side layout. Like Field, its label points at the control, and an optional hint and error are read as the control\'s description.',
  examples: [
    {
      name: 'Text input',
      code: `<FieldRow label="First Name">
  <TextField placeholder="Enter first name" />
</FieldRow>`,
      output: (
        <FieldRow label="First Name">
          <TextField placeholder="Enter first name" />
        </FieldRow>
      )
    },
    {
      name: 'Select input',
      code: `<FieldRow label="Country">
  <Select name="country" options={[
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
  ]} />
</FieldRow>`,
      output: (
        <FieldRow label="Country">
          <Select name="country" options={[
            { label: 'United States', value: 'us' },
            { label: 'Canada', value: 'ca' },
          ]} />
        </FieldRow>
      )
    },
    {
      name: 'Hint and error',
      code: `<FieldRow label="Email" hint="Use your work address">
  <TextField type="email" />
</FieldRow>
<FieldRow label="Email" error="That doesn't look like an email address">
  <TextField type="email" defaultValue="alex@" />
</FieldRow>`,
      output: (
        <>
          <FieldRow label="Email" hint="Use your work address">
            <TextField type="email" />
          </FieldRow>
          <FieldRow label="Email" error="That doesn't look like an email address">
            <TextField type="email" defaultValue="alex@" />
          </FieldRow>
        </>
      )
    },
    {
      name: 'Centered layout',
      code: `<FieldRow label="Accept Terms" centered>
  <TextField placeholder="Type 'accept'" />
</FieldRow>`,
      output: (
        <FieldRow label="Accept Terms" centered>
          <TextField placeholder="Type 'accept'" />
        </FieldRow>
      )
    },
  ]
};
