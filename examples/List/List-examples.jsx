import { useState } from 'react';

import List, { ListHeader, FilterSectionListItem } from '../../components/List';

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

export default {
  name: 'List',
  description: 'A simple list built from an items array. An item with an action is a button that calls it with (index, item, event); one without is plain text. ListHeader and FilterSectionListItem build sectioned, selectable lists.',
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
    }
  ]
};
