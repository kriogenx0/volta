import { useState } from 'react';

import Button from '../../components/Button/Button';
import MultiSelect from '../../components/MultiSelect/MultiSelect';

const TEAMS = [
  { label: 'Design', value: 'design' },
  { label: 'Engineering', value: 'eng' },
  { label: 'Marketing', value: 'mkt' },
  { label: 'Support', value: 'support' },
  { label: 'Finance', value: 'fin' }
];

const labels = (values) => values.map((v) => v.label).join(', ') || 'none';

const WithReadout = (props) => {
  const [selected, setSelected] = useState(props.defaultValue || []);

  return (
    <div className="example-stack">
      <MultiSelect options={TEAMS} {...props} onChange={(values) => setSelected(values)} />
      <p>Selected: {labels(selected)}</p>
    </div>
  );
};

const Controlled = () => {
  const [value, setValue] = useState([TEAMS[1]]);

  return (
    <div className="example-stack">
      <MultiSelect aria-label="Teams" options={TEAMS} value={value} onChange={setValue} />
      <Button onClick={() => setValue(TEAMS)}>Select all</Button>
      <Button onClick={() => setValue([])}>Reset</Button>
      <p>Selected: {labels(value)}</p>
    </div>
  );
};

export default {
  name: 'MultiSelect',
  description: 'A searchable multi-value select built on react-select. Pass options, then read the chosen { label, value } objects from onChange. Options can start selected, be fixed in place, or the whole control can be single-choice, clearable or controlled.',
  examples: [
    {
      name: 'Pick several options',
      code: `<MultiSelect
  aria-label="Teams"
  name="teams"
  placeholder="Choose teams"
  options={teams}
  defaultValue={[{ label: 'Design', value: 'design' }]}
  onChange={(values) => setSelected(values)}
/>`,
      output: <WithReadout aria-label="Teams" name="teams" placeholder="Choose teams" defaultValue={[TEAMS[0]]} />
    },
    {
      name: 'Fixed values and clearing',
      code: `<MultiSelect
  aria-label="Teams"
  clearable
  options={teams}
  defaultValue={[
    { label: 'Engineering', value: 'eng', fixed: true },
    { label: 'Support', value: 'support' },
  ]}
  onChange={(values) => setSelected(values)}
/>`,
      output: (
        <WithReadout
          aria-label="Teams"
          clearable
          defaultValue={[{ ...TEAMS[1], fixed: true }, TEAMS[3]]}
        />
      )
    },
    {
      name: 'Single choice',
      code: `<MultiSelect
  aria-label="Team"
  multiselect={false}
  placeholder="Choose a team"
  options={teams}
  onChange={(values) => setSelected(values)}
/>`,
      output: <WithReadout aria-label="Team" multiselect={false} placeholder="Choose a team" />
    },
    {
      name: 'Controlled by the parent',
      code: `const [value, setValue] = useState([teams[1]]);

<MultiSelect aria-label="Teams" options={teams} value={value} onChange={setValue} />
<Button onClick={() => setValue(teams)}>Select all</Button>
<Button onClick={() => setValue([])}>Reset</Button>`,
      output: <Controlled />
    },
    {
      name: 'Disabled',
      code: '<MultiSelect aria-label="Teams" disabled options={teams} defaultValue={[teams[0], teams[2]]} />',
      output: <MultiSelect aria-label="Teams" disabled options={TEAMS} defaultValue={[TEAMS[0], TEAMS[2]]} />
    }
  ]
};
