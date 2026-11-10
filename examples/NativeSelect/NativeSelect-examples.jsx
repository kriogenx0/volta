import { useState } from 'react';

import NativeSelect from '../../components/NativeSelect/NativeSelect';

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
      <NativeSelect name="city" options={CITIES} value={value} onChange={(e) => setValue(e.target.value)} {...props} />
      <p>Selected: {value}</p>
    </div>
  );
};

const WithPlaceholder = () => {
  const [value, setValue] = useState('');
  return (
    <NativeSelect label="Region" name="region" value={value} onChange={(e) => setValue(e.target.value)}>
      <option value="" disabled>Choose a region</option>
      <optgroup label="Americas">
        <option value="us-east">US East</option>
        <option value="us-west">US West</option>
      </optgroup>
      <optgroup label="Europe">
        <option value="eu-west">EU West</option>
        <option value="eu-central">EU Central</option>
      </optgroup>
    </NativeSelect>
  );
};

export default {
  name: 'NativeSelect',
  description: 'A styled native select. Give it options (label + value) or your own <option> children, and drive it with value and onChange. Add label for a field label above it.',
  examples: [
    {
      name: 'Controlled with state',
      code: `const [value, setValue] = useState('ny');

<NativeSelect
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
      code: '<NativeSelect label="City" optional name="city" options={options} value={value} onChange={handleChange} />',
      output: <City label="City" optional />
    },
    {
      name: 'With a hint and an error',
      code: `<NativeSelect label="City" hint="Where the office is" options={cities} />
<NativeSelect label="City" error="Choose a city" options={cities} />`,
      output: (
        <div className="example-stack">
          <NativeSelect label="City" hint="Where the office is" options={CITIES} />
          <NativeSelect label="City" error="Choose a city" options={CITIES} />
        </div>
      )
    },
    {
      name: 'Medium size',
      code: '<NativeSelect fieldSize="md" name="city" options={options} value={value} onChange={handleChange} />',
      output: <City fieldSize="md" />
    },
    {
      name: 'Disabled',
      code: '<NativeSelect disabled name="city" options={options} value="lon" onChange={handleChange} />',
      output: <NativeSelect disabled name="city" options={CITIES} value="lon" onChange={() => {}} />
    },
    {
      name: 'Own options with a placeholder and groups',
      code: `<NativeSelect label="Region" name="region" value={value} onChange={handleChange}>
  <option value="" disabled>Choose a region</option>
  <optgroup label="Americas">
    <option value="us-east">US East</option>
    <option value="us-west">US West</option>
  </optgroup>
  <optgroup label="Europe">
    <option value="eu-west">EU West</option>
    <option value="eu-central">EU Central</option>
  </optgroup>
</NativeSelect>`,
      output: <WithPlaceholder />
    }
  ]
};
