import { useState } from 'react';

import DropdownList from '../../components/DropdownList/DropdownList';

const FRUIT = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' }
];

const Selectable = (props) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="example-stack">
      <DropdownList options={FRUIT} selectedOption={selected} onSelect={setSelected} {...props} />
      <p>Selected: {selected ? selected.value : 'nothing'}</p>
    </div>
  );
};

const Controlled = () => {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(null);

  // Each option can carry an action that runs when it is chosen
  const options = FRUIT.map((fruit) => ({ ...fruit, action: () => setAction(fruit.label) }));

  return (
    <div className="example-stack">
      <DropdownList options={options} open={open} onToggle={setOpen} />
      <p>The list is {open ? 'open' : 'closed'}. Last action: {action || 'none'}.</p>
    </div>
  );
};

export default {
  name: 'DropdownList',
  description: 'A dropdown of options. Give it options (label plus an optional value and action) and it shows the placeholder until selectedOption is set. Click outside it or press Escape to close it.',
  examples: [
    {
      name: 'Placeholder only',
      code: '<DropdownList options={[{ label: "Apple" }, { label: "Banana" }, { label: "Cherry" }]} />',
      output: <DropdownList options={[{ label: 'Apple' }, { label: 'Banana' }, { label: 'Cherry' }]} />
    },
    {
      name: 'Selection shown on the button',
      code: `const [selected, setSelected] = useState(null);

<DropdownList options={fruit} selectedOption={selected} onSelect={setSelected} />
<p>Selected: {selected ? selected.value : 'nothing'}</p>`,
      output: <Selectable />
    },
    {
      name: 'Keep a custom placeholder',
      code: `<DropdownList
  options={fruit}
  placeholder="Pick a fruit"
  setPlaceholder={false}
  selectedOption={selected}
  onSelect={setSelected}
/>`,
      output: <Selectable placeholder="Pick a fruit" setPlaceholder={false} />
    },
    {
      name: 'No options',
      code: '<DropdownList options={[]} placeholder="Nothing to choose" />',
      output: <DropdownList options={[]} placeholder="Nothing to choose" />
    },
    {
      name: 'Controlled open with actions',
      code: `const [open, setOpen] = useState(false);
const options = fruit.map((f) => ({ ...f, action: () => setAction(f.label) }));

<DropdownList options={options} open={open} onToggle={setOpen} />`,
      output: <Controlled />
    }
  ]
};
