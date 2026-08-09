import { useState } from 'react';
import RadioGroup from './RadioGroup';

const RadioGroupExample = () => {
  const [value, setValue] = useState('pro');
  const options = [
    { label: 'Free', value: 'free' },
    { label: 'Pro', value: 'pro' },
    { label: 'Enterprise', value: 'enterprise' },
  ];
  const handleChange = (e) => setValue(e.target.value);
  return (
    <div>
      <RadioGroup name="plan" options={options} value={value} onChange={handleChange} />
      <p style={{ marginTop: 8, fontSize: 12 }}>Selected: {value}</p>
    </div>
  );
};

export default {
  name: 'RadioGroup',
  description: 'A group of radio buttons sharing a name, with controlled selection.',
  examples: [
    {
      name: 'RadioGroup',
      code: `<RadioGroup
  name="plan"
  options={[
    { label: 'Free', value: 'free' },
    { label: 'Pro', value: 'pro' },
    { label: 'Enterprise', value: 'enterprise' },
  ]}
  value={value}
  onChange={handleChange}
/>`,
      output: <RadioGroupExample />
    },
  ]
};
