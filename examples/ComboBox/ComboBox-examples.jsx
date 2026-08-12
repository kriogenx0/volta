import { useState } from 'react';

import ComboBox from '../../components/ComboBox/ComboBox';

const cities = [
  'Amsterdam, Netherlands',
  'Barcelona, Spain',
  'Berlin, Germany',
  'Copenhagen, Denmark',
  'Lisbon, Portugal',
  'London, United Kingdom',
  'New York, United States',
  'Paris, France',
  'San Francisco, United States',
  'Singapore',
  'Sydney, Australia',
  'Tokyo, Japan',
];

const teammates = [
  'Aisha Rahman — Product Design',
  'Caleb Williams — Engineering',
  'Elena García — Research',
  'Jordan Lee — Product Management',
  'Maya Patel — Data Science',
  'Noah Thompson — Marketing',
  'Sofia Andersson — Customer Success',
];

const timeZones = [
  'America/Los_Angeles (UTC−08:00)',
  'America/Denver (UTC−07:00)',
  'America/Chicago (UTC−06:00)',
  'America/New_York (UTC−05:00)',
  'Europe/London (UTC+00:00)',
  'Europe/Paris (UTC+01:00)',
  'Asia/Kolkata (UTC+05:30)',
  'Asia/Singapore (UTC+08:00)',
  'Asia/Tokyo (UTC+09:00)',
  'Australia/Sydney (UTC+11:00)',
];

const ExampleFrame = ({ children }) => (
  <div style={{ maxWidth: 420 }}>{children}</div>
);

const CitySearch = () => {
  const [selected, setSelected] = useState('');

  return (
    <ExampleFrame>
      <ComboBox
        options={cities}
        placeholder="Search for a city…"
        onSelect={setSelected}
      />
      <p style={{ margin: '10px 0 0', color: 'var(--v-color-trim-subtle)', fontSize: 12 }}>
        {selected ? `Selected: ${selected}` : 'Start typing or use the arrow keys to browse.'}
      </p>
    </ExampleFrame>
  );
};

const AssigneePicker = () => {
  const [assignee, setAssignee] = useState('Jordan Lee — Product Management');

  return (
    <ExampleFrame>
      <ComboBox
        options={teammates}
        value={assignee}
        onChange={setAssignee}
        onSelect={setAssignee}
        placeholder="Find a teammate…"
      />
      <p style={{ margin: '10px 0 0', color: 'var(--v-color-trim-subtle)', fontSize: 12 }}>
        Current assignee: {assignee || 'Unassigned'}
      </p>
    </ExampleFrame>
  );
};

export default {
  name: 'ComboBox',
  description: 'A searchable text input with filtered suggestions, keyboard navigation, and controlled or uncontrolled values.',
  examples: [
    {
      name: 'Search a dataset',
      code: `const cities = [
  'Amsterdam, Netherlands',
  'Barcelona, Spain',
  'Berlin, Germany',
  'London, United Kingdom',
  'New York, United States',
  'San Francisco, United States',
  'Singapore',
  'Sydney, Australia',
  'Tokyo, Japan',
];

<ComboBox
  options={cities}
  placeholder="Search for a city…"
  onSelect={(city) => setSelected(city)}
/>`,
      output: <CitySearch />,
    },
    {
      name: 'Controlled assignee picker',
      code: `const [assignee, setAssignee] = useState(
  'Jordan Lee — Product Management'
);

<ComboBox
  options={teammates}
  value={assignee}
  onChange={setAssignee}
  onSelect={setAssignee}
  placeholder="Find a teammate…"
/>`,
      output: <AssigneePicker />,
    },
    {
      name: 'Prefilled time zone',
      code: `<ComboBox
  options={timeZones}
  defaultValue="America/Los_Angeles (UTC−08:00)"
  onCommit={(timeZone) => savePreference(timeZone)}
/>`,
      output: (
        <ExampleFrame>
          <ComboBox
            options={timeZones}
            defaultValue="America/Los_Angeles (UTC−08:00)"
          />
        </ExampleFrame>
      ),
    },
    {
      name: 'Disabled',
      code: `<ComboBox
  options={cities}
  defaultValue="Tokyo, Japan"
  disabled
/>`,
      output: (
        <ExampleFrame>
          <ComboBox options={cities} defaultValue="Tokyo, Japan" disabled />
        </ExampleFrame>
      ),
    },
  ],
};
