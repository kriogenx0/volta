import { useState } from 'react';

import SideBarList from '../../components/SideBarList/SideBarList';

const groups = [
  { items: [{ value: null, label: 'All' }] },
  { label: 'Inputs', items: ['TextBox', 'ComboBox', 'DatePicker'] },
  { label: 'Layout', items: ['Card', 'Drawer'] }
];

const Basic = () => {
  const [value, setValue] = useState(null);
  return (
    <SideBarList ariaLabel="Components" groups={groups} value={value} onSelect={setValue} />
  );
};

export default {
  name: 'SideBarList',
  description: 'A list of choices in labelled groups for a side column, with one current item.',
  examples: [
    {
      name: 'Groups',
      code: `<SideBarList
  groups={[
    { items: [{ value: null, label: 'All' }] },
    { label: 'Inputs', items: ['TextBox', 'ComboBox', 'DatePicker'] },
    { label: 'Layout', items: ['Card', 'Drawer'] }
  ]}
  value={value}
  onSelect={setValue}
/>`,
      output: <Basic />
    },
    {
      name: 'No matches',
      code: `<SideBarList groups={[]} emptyMessage="No components match" />`,
      output: <SideBarList groups={[]} emptyMessage="No components match" />
    }
  ]
};
