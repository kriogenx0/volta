import { useState } from 'react';
import CheckboxGroup from './CheckboxGroup';

const CheckboxGroupExample = () => {
  const [value, setValue] = useState([]);
  const options = [
    { label: 'Apples', value: 'apples' },
    { label: 'Bananas', value: 'bananas' },
    { label: 'Cherries', value: 'cherries' },
  ];

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
  };

  return (
    <div>
      <CheckboxGroup name="fruits" options={options} value={value} onChange={handleChange} />
      <p style={{ marginTop: 8, fontSize: 12 }}>Selected: {value.join(', ') || 'none'}</p>
    </div>
  );
};

export default {
  name: 'CheckboxGroup',
  description: 'A group of related checkboxes sharing a single name.',
  examples: [
    {
      name: 'CheckboxGroup',
      code: `<CheckboxGroup
  name="fruits"
  options={[
    { label: 'Apples', value: 'apples' },
    { label: 'Bananas', value: 'bananas' },
    { label: 'Cherries', value: 'cherries' },
  ]}
  value={value}
  onChange={handleChange}
/>`,
      output: <CheckboxGroupExample />
    }
  ]
};
