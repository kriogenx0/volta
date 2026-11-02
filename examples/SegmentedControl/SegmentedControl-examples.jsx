import { useState } from 'react';

import SegmentedControl from '../../components/SegmentedControl/SegmentedControl';

const VIEWS = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' }
];

const Options = (props) => {
  const [view, setView] = useState('week');
  return (
    <div>
      <SegmentedControl ariaLabel="Calendar view" options={VIEWS} value={view} onChange={setView} {...props} />
      <p>Selected: {view}</p>
    </div>
  );
};

const Tabs = () => {
  const [index, setIndex] = useState(0);
  return (
    <div>
      <SegmentedControl mini tabs={['Desktop', 'Mobile']} selectedTabIndex={index} onChange={setIndex} ariaLabel="Preview device" />
      <p>Selected index: {index}</p>
    </div>
  );
};

export default {
  name: 'SegmentedControl',
  description: 'Choose one of a few options. Describe them with options + value, or with tabs + selectedTabIndex. Add mini for a compact version. SegmentedControlMini is an alias for <SegmentedControl mini />.',
  examples: [
    {
      name: 'SegmentedControl',
      code: `const [view, setView] = useState('week');

<SegmentedControl
  ariaLabel="Calendar view"
  options={[
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ]}
  value={view}
  onChange={setView}
/>`,
      output: <Options />
    },
    {
      name: 'Small',
      code: '<SegmentedControl size="sm" options={options} value={view} onChange={setView} />',
      output: <Options size="sm" />
    },
    {
      name: 'Mini',
      code: '<SegmentedControl mini options={options} value={view} onChange={setView} />',
      output: <Options mini />
    },
    {
      name: 'Mini with tabs (selected by index)',
      code: `const [index, setIndex] = useState(0);

<SegmentedControl
  mini
  tabs={['Desktop', 'Mobile']}
  selectedTabIndex={index}
  onChange={setIndex}   // (index, label)
  ariaLabel="Preview device"
/>`,
      output: <Tabs />
    },
    {
      name: 'Disabled',
      code: '<SegmentedControl disabled options={options} value="week" />',
      output: <SegmentedControl disabled ariaLabel="Calendar view" options={VIEWS} value="week" />
    },
    {
      name: 'Legacy tab bar form (no options)',
      code: '<SegmentedControl tabs={[\'Day\', \'Week\', \'Month\']} selectedTabIndex={1} onChange={(index, label) => {}} />',
      output: <SegmentedControl tabs={['Day', 'Week', 'Month']} selectedTabIndex={1} />
    }
  ]
};
