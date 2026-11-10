import { useState } from 'react';

import List, { ListHeader, ListRow, FilterSectionListItem } from '../../components/List';

const STATUSES = [
  { name: 'All', value: 'all' },
  { name: 'Open', value: 'open' },
  { name: 'Closed', value: 'closed' }
];

const ClickableList = () => {
  const [clicked, setClicked] = useState('nothing yet');
  const items = [
    { label: 'Profile', action: (index, item) => setClicked(item.label) },
    { label: 'Settings', action: (index, item) => setClicked(item.label) },
    { label: 'Log out', action: (index, item) => setClicked(item.label) }
  ];

  return (
    <div className="example-stack">
      <List items={items} />
      <p>Clicked: {clicked}</p>
    </div>
  );
};

const FilterList = () => {
  const [status, setStatus] = useState('open');

  return (
    <div className="example-stack">
      <ul className="volta-list">
        <ListHeader title="Status" />
        {STATUSES.map((item) => (
          <FilterSectionListItem key={item.value} name={item.name} value={item.value} selected={status === item.value} onChange={setStatus} />
        ))}
      </ul>
      <p>Filtering by: {status}</p>
    </div>
  );
};

const PROJECTS = ['Apollo', 'Borealis', 'Cascade'];

const ProjectPicker = () => {
  const [project, setProject] = useState('Apollo');

  return (
    <div className="example-stack">
      <List card>
        {PROJECTS.map((name) => (
          <ListRow key={name} onClick={() => setProject(name)}>
            <span>{name}</span>
            <span>{project === name ? 'Current' : 'Switch'}</span>
          </ListRow>
        ))}
      </List>
      <p>Current project: {project}</p>
    </div>
  );
};

export default {
  name: 'List',
  description: 'A vertical list of rows, each plain text or a button, with optional section headers and selectable rows. With card it is the same list in a bordered card with dividers, and ListRow lets you write the rows yourself: buttons by default (they react to the cursor), or as="div" for static lines. ListCard is List with card.',
  examples: [
    {
      name: 'Plain items',
      code: `<List
  items={[
    { label: 'Alex Vaos' },
    { label: 'Sam Rivera' },
    { label: 'Priya Patel' },
  ]}
/>`,
      output: <List items={[{ label: 'Alex Vaos' }, { label: 'Sam Rivera' }, { label: 'Priya Patel' }]} />
    },
    {
      name: 'Items with actions',
      code: `const [clicked, setClicked] = useState('nothing yet');

<List
  items={[
    { label: 'Profile', action: (index, item) => setClicked(item.label) },
    { label: 'Settings', action: (index, item) => setClicked(item.label) },
    { label: 'Log out', action: (index, item) => setClicked(item.label) },
  ]}
/>`,
      output: <ClickableList />
    },
    {
      name: 'Mixed text and actions',
      code: `<List
  items={[
    { label: 'Signed in as alex@example.com' },
    { label: 'Switch account', action: () => switchAccount() },
  ]}
/>`,
      output: <List items={[{ label: 'Signed in as alex@example.com' }, { label: 'Switch account', action: () => {} }]} />
    },
    {
      name: 'Header with selectable rows',
      code: `const [status, setStatus] = useState('open');

<ul className="volta-list">
  <ListHeader title="Status" />
  {statuses.map((item) => (
    <FilterSectionListItem
      key={item.value}
      name={item.name}
      value={item.value}
      selected={status === item.value}
      onChange={setStatus}
    />
  ))}
</ul>`,
      output: <FilterList />
    },
    {
      name: 'In a card: clickable rows',
      code: `const [project, setProject] = useState('Apollo');

<List card>
  {['Apollo', 'Borealis', 'Cascade'].map((name) => (
    <ListRow key={name} onClick={() => setProject(name)}>
      <span>{name}</span>
      <span>{project === name ? 'Current' : 'Switch'}</span>
    </ListRow>
  ))}
</List>`,
      output: <ProjectPicker />
    },
    {
      name: 'In a card: static rows',
      code: `<List card>
  <ListRow as="div"><span>Plan</span><span>Team</span></ListRow>
  <ListRow as="div"><span>Seats</span><span>12</span></ListRow>
  <ListRow as="div"><span>Renews</span><span>Jan 1, 2027</span></ListRow>
</List>`,
      output: (
        <List card>
          <ListRow as="div"><span>Plan</span><span>Team</span></ListRow>
          <ListRow as="div"><span>Seats</span><span>12</span></ListRow>
          <ListRow as="div"><span>Renews</span><span>Jan 1, 2027</span></ListRow>
        </List>
      )
    },
    {
      name: 'Static header over actions',
      code: `<List card>
  <ListRow as="div"><span>Billing</span></ListRow>
  <ListRow onClick={updateCard}><span>Update payment method</span></ListRow>
  <ListRow onClick={downloadInvoices}><span>Download invoices</span></ListRow>
</List>`,
      output: (
        <List card>
          <ListRow as="div"><span>Billing</span></ListRow>
          <ListRow onClick={() => {}}><span>Update payment method</span></ListRow>
          <ListRow onClick={() => {}}><span>Download invoices</span></ListRow>
        </List>
      )
    },
    {
      name: 'Single row',
      code: `<List card>
  <ListRow onClick={invite}><span>Invite a teammate</span></ListRow>
</List>`,
      output: (
        <List card>
          <ListRow onClick={() => {}}><span>Invite a teammate</span></ListRow>
        </List>
      )
    }
  ]
};
