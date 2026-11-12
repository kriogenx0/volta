import { useState } from 'react';

import Toggle from '../../components/Toggle';

const Controlled = () => {
  const [enabled, setEnabled] = useState(true);
  return (
    <div>
      <Toggle aria-label="Notifications" name="notifications" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
      <p>Notifications are {enabled ? 'on' : 'off'}</p>
    </div>
  );
};

export default {
  name: 'Toggle',
  description: 'An on/off switch for a setting that applies immediately. Use it uncontrolled (defaultChecked) or controlled (checked + onChange); other props, such as aria-label, go to the native checkbox underneath. showMarks prints an I on the on side and an O on the off side. The knob is small by default; knobSize="md" keeps the larger knob it used to have.',
  examples: [
    {
      name: 'Off',
      code: '<Toggle aria-label="Dark mode" />',
      output: <Toggle aria-label="Dark mode" />
    },
    {
      name: 'Larger knob',
      code: '<Toggle aria-label="Dark mode" knobSize="md" defaultChecked />',
      output: <Toggle aria-label="Dark mode" knobSize="md" defaultChecked />
    },
    {
      name: 'On by default',
      code: '<Toggle aria-label="Dark mode" defaultChecked />',
      output: <Toggle aria-label="Dark mode" defaultChecked />
    },
    {
      name: 'Controlled with state',
      code: `const [enabled, setEnabled] = useState(true);

<Toggle
  aria-label="Notifications"
  name="notifications"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>`,
      output: <Controlled />
    },
    {
      name: 'Disabled',
      code: `<Toggle aria-label="Locked off" isDisabled />
<Toggle aria-label="Locked on" isDisabled defaultChecked />`,
      output: (
        <div className="example-stack">
          <Toggle aria-label="Locked off" isDisabled />
          <Toggle aria-label="Locked on" isDisabled defaultChecked />
        </div>
      )
    },
    {
      name: 'With I and O marks',
      code: `<Toggle aria-label="Wi-Fi" showMarks />
<Toggle aria-label="Bluetooth" showMarks defaultChecked />`,
      output: (
        <div className="example-stack">
          <Toggle aria-label="Wi-Fi" showMarks />
          <Toggle aria-label="Bluetooth" showMarks defaultChecked />
        </div>
      )
    }
  ]
};
