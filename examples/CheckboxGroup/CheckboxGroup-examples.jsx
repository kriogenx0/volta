import { useState } from 'react';

import CheckboxGroup from '../../components/CheckboxGroup/CheckboxGroup';

const FRUITS = [
  { label: 'Apples', value: 'apples' },
  { label: 'Bananas', value: 'bananas' },
  { label: 'Cherries', value: 'cherries' }
];

const toggleValue = (values, value) => (
  values.includes(value) ? values.filter((v) => v !== value) : [...values, value]
);

const Controlled = ({ initial = [], ...props }) => {
  const [value, setValue] = useState(initial);
  return (
    <div>
      <CheckboxGroup
        name="fruits"
        options={FRUITS}
        value={value}
        onChange={(e) => setValue((prev) => toggleValue(prev, e.target.value))}
        {...props}
      />
      <p>Selected: {value.join(', ') || 'none'}</p>
    </div>
  );
};

export default {
  name: 'CheckboxGroup',
  description: 'A group of related checkboxes sharing one name. The group is controlled: value is the array of checked option values, and onChange fires with the change event of the option that was toggled.',
  examples: [
    {
      name: 'Controlled with state',
      code: `const [value, setValue] = useState([]);

<CheckboxGroup
  name="fruits"
  options={[
    { label: 'Apples', value: 'apples' },
    { label: 'Bananas', value: 'bananas' },
    { label: 'Cherries', value: 'cherries' },
  ]}
  value={value}
  onChange={(e) => setValue((prev) => (
    prev.includes(e.target.value)
      ? prev.filter((v) => v !== e.target.value)
      : [...prev, e.target.value]
  ))}
/>`,
      output: <Controlled />
    },
    {
      name: 'With options already checked',
      code: `const [value, setValue] = useState(['apples', 'cherries']);

<CheckboxGroup name="fruits" options={options} value={value} onChange={handleChange} />`,
      output: <Controlled initial={['apples', 'cherries']} />
    },
    {
      name: 'Disabled',
      code: '<CheckboxGroup disabled name="fruits" options={options} value={[\'bananas\']} />',
      output: <CheckboxGroup disabled name="fruits" options={FRUITS} value={['bananas']} />
    }
  ]
};
