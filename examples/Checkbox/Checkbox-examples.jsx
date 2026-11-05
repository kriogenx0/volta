import { useState } from 'react';

import Checkbox from '../../components/Checkbox';

const Controlled = () => {
  const [subscribed, setSubscribed] = useState(true);
  return (
    <div>
      <Checkbox label="Email me product updates" checked={subscribed} onChange={(e) => setSubscribed(e.target.checked)} />
      <p>Subscribed: {subscribed ? 'yes' : 'no'}</p>
    </div>
  );
};

export default {
  name: 'Checkbox',
  description: 'A styled checkbox that looks the same in every browser. Use it uncontrolled (defaultChecked) or controlled (checked + onChange); any other props go to the native input.',
  examples: [
    {
      name: 'Unchecked',
      code: '<Checkbox label="Check me" />',
      output: <Checkbox label="Check me" />
    },
    {
      name: 'Checked by default',
      code: '<Checkbox label="Check me" defaultChecked />',
      output: <Checkbox label="Check me" defaultChecked />
    },
    {
      name: 'Controlled with state',
      code: `const [subscribed, setSubscribed] = useState(true);

<Checkbox
  label="Email me product updates"
  checked={subscribed}
  onChange={(e) => setSubscribed(e.target.checked)}
/>`,
      output: <Controlled />
    },
    {
      name: 'Disabled',
      code: `<Checkbox label="Not available" disabled />
<Checkbox label="Locked on" disabled defaultChecked />`,
      output: (
        <div className="example-stack">
          <Checkbox label="Not available" disabled />
          <Checkbox label="Locked on" disabled defaultChecked />
        </div>
      )
    },
    {
      name: 'Without a visible label',
      code: '<Checkbox aria-label="Select row 3" />',
      output: <Checkbox aria-label="Select row 3" />
    }
  ]
};
