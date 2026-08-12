import FormField from '../../components/FormField/FormField';
import TextField from '../../components/TextField/TextField';
import Select from '../../components/Select/Select';

export default {
  name: 'FormField',
  description: 'A labeled form field container with consistent spacing.',
  examples: [
    {
      name: 'Text input',
      code: `<FormField label="First Name">
  <TextField placeholder="Enter first name" />
</FormField>`,
      output: (
        <FormField label="First Name">
          <TextField placeholder="Enter first name" />
        </FormField>
      )
    },
    {
      name: 'Select input',
      code: `<FormField label="Country">
  <Select name="country" options={[
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
  ]} />
</FormField>`,
      output: (
        <FormField label="Country">
          <Select name="country" options={[
            { label: 'United States', value: 'us' },
            { label: 'Canada', value: 'ca' },
          ]} />
        </FormField>
      )
    },
    {
      name: 'Centered layout',
      code: `<FormField label="Accept Terms" centered>
  <TextField placeholder="Type 'accept'" />
</FormField>`,
      output: (
        <FormField label="Accept Terms" centered>
          <TextField placeholder="Type 'accept'" />
        </FormField>
      )
    },
  ]
};
