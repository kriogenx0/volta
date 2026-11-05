import { useState } from 'react';

import ActionMenu from '../../components/ActionMenu/ActionMenu';

const WithActions = () => {
  const [last, setLast] = useState(null);

  const items = [
    { label: 'Rename', action: () => setLast('Rename') },
    { label: 'Duplicate', action: () => setLast('Duplicate') },
    { label: 'Delete', action: () => setLast('Delete') }
  ];

  return (
    <div className="example-stack">
      <ActionMenu items={items} />
      <p>Last action: {last || 'none'}</p>
    </div>
  );
};

const Reporting = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className="example-stack">
      <ActionMenu
        items={['Archive', 'Move to trash']}
        onToggle={setOpen}
        onSelect={(item, index) => setSelected(`${item} (index ${index})`)}
      />
      <p>The menu is {open ? 'open' : 'closed'}. Selected: {selected || 'nothing'}.</p>
    </div>
  );
};

export default {
  name: 'ActionMenu',
  description: 'An ellipsis button that opens a menu of quick actions. Items are plain labels or objects with a label and an action. Click outside it or press Escape to close it.',
  examples: [
    {
      name: 'Plain labels',
      code: '<ActionMenu items={["Edit", "Share", "Delete"]} />',
      output: <ActionMenu items={['Edit', 'Share', 'Delete']} />
    },
    {
      name: 'Items with actions',
      code: `const items = [
  { label: 'Rename', action: () => setLast('Rename') },
  { label: 'Duplicate', action: () => setLast('Duplicate') },
  { label: 'Delete', action: () => setLast('Delete') },
];

<ActionMenu items={items} />
<p>Last action: {last || 'none'}</p>`,
      output: <WithActions />
    },
    {
      name: 'Reporting selection and toggling',
      code: `<ActionMenu
  items={['Archive', 'Move to trash']}
  onToggle={setOpen}
  onSelect={(item, index) => setSelected(\`\${item} (index \${index})\`)}
/>`,
      output: <Reporting />
    }
  ]
};
