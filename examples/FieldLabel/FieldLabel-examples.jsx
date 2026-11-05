import { useId, useState } from 'react';

import FieldLabel from '../../components/FieldLabel/FieldLabel';
import TextField from '../../components/TextField/TextField';
import Select from '../../components/Select/Select';

// Each demo makes its own id so several can sit on one page and the label
// always points at its own control.
const NameField = (props) => {
  const id = useId();
  const [name, setName] = useState('');
  return (
    <div>
      <FieldLabel htmlFor={id} {...props}>Full name</FieldLabel>
      <TextField id={id} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" />
    </div>
  );
};

const PlanField = () => {
  const id = useId();
  const [plan, setPlan] = useState('team');
  return (
    <div>
      <FieldLabel htmlFor={id}>Plan</FieldLabel>
      <Select id={id} value={plan} onChange={(e) => setPlan(e.target.value)} options={[
        { label: 'Personal', value: 'personal' },
        { label: 'Team', value: 'team' },
        { label: 'Enterprise', value: 'enterprise' }
      ]} />
    </div>
  );
};

const BillingField = () => {
  const id = useId();
  const [address, setAddress] = useState('');
  return (
    <div>
      <FieldLabel htmlFor={id}>Billing <strong>address</strong></FieldLabel>
      <TextField id={id} multiline rows={3} value={address} onChange={(e) => setAddress(e.target.value)} />
    </div>
  );
};

const REGIONS = [
  { label: 'North America', value: 'na' },
  { label: 'Europe', value: 'eu' }
];

// TextField and Select draw their own FieldLabel when given a label.
const Labelled = () => {
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('eu');
  return (
    <div className="example-stack">
      <TextField label="Email" optional value={email} onChange={(e) => setEmail(e.target.value)} />
      <Select label="Region" value={region} onChange={(e) => setRegion(e.target.value)} options={REGIONS} />
    </div>
  );
};

export default {
  name: 'FieldLabel',
  description: 'The caption above a form control. Point htmlFor at the control\'s id so clicking the label focuses it and screen readers announce it; add optional to mark a field as not required. TextField and Select render one for you when given a label.',
  examples: [
    {
      name: 'Label for a text field',
      code: `<FieldLabel htmlFor="full_name">Full name</FieldLabel>
<TextField id="full_name" value={name} onChange={handleChange} />`,
      output: <NameField />
    },
    {
      name: 'Optional field',
      code: `<FieldLabel htmlFor="full_name" optional>Full name</FieldLabel>
<TextField id="full_name" value={name} onChange={handleChange} />`,
      output: <NameField optional />
    },
    {
      name: 'Label for a select',
      code: `<FieldLabel htmlFor="plan">Plan</FieldLabel>
<Select id="plan" value={plan} onChange={handleChange} options={plans} />`,
      output: <PlanField />
    },
    {
      name: 'Formatted label text',
      code: `<FieldLabel htmlFor="billing">Billing <strong>address</strong></FieldLabel>
<TextField id="billing" multiline rows={3} value={address} onChange={handleChange} />`,
      output: <BillingField />
    },
    {
      name: 'Rendered by TextField and Select',
      code: `<TextField label="Email" optional value={email} onChange={handleChange} />
<Select label="Region" value={region} onChange={handleChange} options={regions} />`,
      output: <Labelled />
    }
  ]
};
