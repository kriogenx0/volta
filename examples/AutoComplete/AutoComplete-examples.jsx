import { useState } from 'react';

import AutoComplete from '../../components/AutoComplete';

const PEOPLE = [
  { title: 'Alex Vaos', value: 'alex' },
  { title: 'Ana Silva', value: 'ana' },
  { title: 'Ben Carter', value: 'ben' },
  { title: 'Chloe Nguyen', value: 'chloe' },
  { title: 'Dev Patel', value: 'dev' },
  { title: 'Elena Rossi', value: 'elena' }
];

const FRAMEWORKS = [
  { title: 'React', value: 'react' },
  { title: 'Vue', value: 'vue' },
  { title: 'Svelte', value: 'svelte' },
  { title: 'Solid', value: 'solid' }
];

// Keeps the chosen items in state and lists them under the box
const Controlled = ({ initial = [], ...props }) => {
  const [selected, setSelected] = useState(initial);

  return (
    <div className="example-stack">
      <AutoComplete selected={selected} onChange={setSelected} {...props} />
      <p>Selected: {selected.map((item) => item.title).join(', ') || 'none'}</p>
    </div>
  );
};

const WithFooter = () => {
  const [clicks, setClicks] = useState(0);

  return (
    <div className="example-stack">
      <AutoComplete
        options={PEOPLE}
        aria-label="Assign to"
        placeholder="Assign to..."
        compact
        footerTitle="Invite someone new"
        onFooterClick={() => setClicks((count) => count + 1)}
      />
      <p>Invite link clicked {clicks} {clicks === 1 ? 'time' : 'times'}.</p>
    </div>
  );
};

export default {
  name: 'AutoComplete',
  description: 'A search box that turns matches into removable pills. Give it options ({ title, value }), keep the chosen ones in state with selected and onChange, and type, use the arrow keys with Enter, or click to choose.',
  examples: [
    {
      name: 'Pick several',
      code: `const [selected, setSelected] = useState([]);

<AutoComplete
  name="people"
  placeholder="Search people..."
  options={people}
  selected={selected}
  onChange={setSelected}
/>`,
      output: <Controlled name="people" placeholder="Search people..." options={PEOPLE} />
    },
    {
      name: 'Single choice',
      code: `<AutoComplete
  limit={1}
  placeholder="Pick a framework"
  options={frameworks}
  selected={selected}
  onChange={setSelected}
/>`,
      output: <Controlled limit={1} placeholder="Pick a framework" options={FRAMEWORKS} initial={[FRAMEWORKS[0]]} />
    },
    {
      name: 'Add your own values',
      code: `<AutoComplete
  allowAdd
  placeholder="Add a tag..."
  options={tags}
  selected={selected}
  onChange={setSelected}
  onAdd={(tag) => console.log('new tag', tag)}
/>`,
      output: <Controlled allowAdd placeholder="Add a tag..." options={FRAMEWORKS} />
    },
    {
      name: 'Email addresses',
      code: `<AutoComplete
  detect="email"
  placeholder="Type an email address"
  options={contacts}
  selected={selected}
  onChange={setSelected}
/>`,
      output: <Controlled detect="email" placeholder="Type an email address" options={[{ title: 'alex@example.com', value: 'alex@example.com' }, { title: 'ana@example.com', value: 'ana@example.com' }]} />
    },
    {
      name: 'Compact rows with a footer link',
      code: `<AutoComplete
  compact
  aria-label="Assign to"
  placeholder="Assign to..."
  options={people}
  footerTitle="Invite someone new"
  onFooterClick={() => openInvite()}
/>`,
      output: <WithFooter />
    }
  ]
};
