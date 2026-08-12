import { useState } from 'react';
import Select from '../../components/Select/Select';

const SelectExample = () => {
  const [value, setValue] = useState('');
  const options = [
    { label: 'San Francisco', value: 'sf' },
    { label: 'New York', value: 'ny' },
    { label: 'London', value: 'lon' },
    { label: 'Tokyo', value: 'tok' },
  ];
  return (
    <Select
      name="city"
      options={options}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default {
  name: 'Select',
  description: 'A styled native select dropdown.',
  examples: [
    {
      name: 'Select',
      code: `<Select
  name="city"
  options={[
    { label: 'San Francisco', value: 'sf' },
    { label: 'New York', value: 'ny' },
    { label: 'London', value: 'lon' },
  ]}
  value={value}
  onChange={handleChange}
/>`,
      output: <SelectExample />
    },
  ]
};
