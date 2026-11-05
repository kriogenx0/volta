import { useState } from 'react';

import Select from '../../components/Select/Select';

const CITIES = [
  { label: 'San Francisco', value: 'sf' },
  { label: 'New York', value: 'ny' },
  { label: 'London', value: 'lon' },
  { label: 'Tokyo', value: 'tok' }
];

const City = (props) => {
  const [value, setValue] = useState('ny');
  return (
    <div>
      <Select name="city" options={CITIES} value={value} onChange={(e) => setValue(e.target.value)} {...props} />
      <p>Selected: {value}</p>
    </div>
  );
};

const WithPlaceholder = () => {
  const [value, setValue] = useState('');
  return (
    <Select label="Region" name="region" value={value} onChange={(e) => setValue(e.target.value)}>
      <option value="" disabled>Choose a region</option>
      <optgroup label="Americas">
        <option value="us-east">US East</option>
        <option value="us-west">US West</option>
      </optgroup>
      <optgroup label="Europe">
        <option value="eu-west">EU West</option>
        <option value="eu-central">EU Central</option>
      </optgroup>
    </Select>
  );
};

export default {
  name: 'Select',
  description: 'A styled native select. Give it options (label + value) or your own <option> children, and drive it with value and onChange. Add label for a field label above it.',
  examples: [
    {
      name: 'Controlled with state',
      code: `const [value, setValue] = useState('ny');

<Select
  name="city"
  options={[
    { label: 'San Francisco', value: 'sf' },
    { label: 'New York', value: 'ny' },
    { label: 'London', value: 'lon' },
    { label: 'Tokyo', value: 'tok' },
  ]}
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>`,
      output: <City />
    },
    {
      name: 'With a label',
      code: '<Select label="City" optional name="city" options={options} value={value} onChange={handleChange} />',
      output: <City label="City" optional />
    },
    {
      name: 'Medium size',
      code: '<Select fieldSize="md" name="city" options={options} value={value} onChange={handleChange} />',
      output: <City fieldSize="md" />
    },
    {
      name: 'Disabled',
      code: '<Select disabled name="city" options={options} value="lon" onChange={handleChange} />',
      output: <Select disabled name="city" options={CITIES} value="lon" onChange={() => {}} />
    },
    {
      name: 'Own options with a placeholder and groups',
      code: `<Select label="Region" name="region" value={value} onChange={handleChange}>
  <option value="" disabled>Choose a region</option>
  <optgroup label="Americas">
    <option value="us-east">US East</option>
    <option value="us-west">US West</option>
  </optgroup>
  <optgroup label="Europe">
    <option value="eu-west">EU West</option>
    <option value="eu-central">EU Central</option>
  </optgroup>
</Select>`,
      output: <WithPlaceholder />
    }
  ]
};
