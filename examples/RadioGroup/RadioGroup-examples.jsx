import { useState } from 'react';

import RadioGroup from '../../components/RadioGroup/RadioGroup';

const PLANS = [
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise' }
];

const SEATS = [
  { label: '1 seat', value: 1 },
  { label: '5 seats', value: 5 },
  { label: '10 seats', value: 10 }
];

const Plan = ({ initial }) => {
  const [value, setValue] = useState(initial);
  return (
    <div>
      <RadioGroup name={`plan-${initial || 'none'}`} options={PLANS} value={value} onChange={(e) => setValue(e.target.value)} />
      <p>Selected: {value || 'nothing yet'}</p>
    </div>
  );
};

const Seats = () => {
  const [seats, setSeats] = useState(5);
  return (
    <div>
      <RadioGroup name="seats" options={SEATS} value={seats} onChange={(e) => setSeats(Number(e.target.value))} />
      <p>Seats: {seats} ({typeof seats})</p>
    </div>
  );
};

export default {
  name: 'RadioGroup',
  description: 'A group of radio buttons that share a name, so exactly one can be chosen. It is controlled: value is the chosen option\'s value, and onChange fires with the change event.',
  examples: [
    {
      name: 'Controlled with state',
      code: `const [value, setValue] = useState('pro');

<RadioGroup
  name="plan"
  options={[
    { label: 'Free', value: 'free' },
    { label: 'Pro', value: 'pro' },
    { label: 'Enterprise', value: 'enterprise' },
  ]}
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>`,
      output: <Plan initial="pro" />
    },
    {
      name: 'Nothing chosen yet',
      code: `const [value, setValue] = useState('');

<RadioGroup name="plan" options={options} value={value} onChange={(e) => setValue(e.target.value)} />`,
      output: <Plan initial="" />
    },
    {
      name: 'Numeric option values',
      code: `const [seats, setSeats] = useState(5);

<RadioGroup
  name="seats"
  options={[
    { label: '1 seat', value: 1 },
    { label: '5 seats', value: 5 },
    { label: '10 seats', value: 10 },
  ]}
  value={seats}
  onChange={(e) => setSeats(Number(e.target.value))}   // the event value is a string
/>`,
      output: <Seats />
    }
  ]
};
