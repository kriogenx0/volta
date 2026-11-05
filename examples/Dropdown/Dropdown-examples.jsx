import { useState } from 'react';

import Button from '../../components/Button/Button';
import Dropdown from '../../components/Dropdown/Dropdown';
import DropdownListItem from '../../components/DropdownList/DropdownListItem';

const CHOICES = ['Profile', 'Settings', 'Sign out'];

const noop = () => {};

// The contents of a dropdown are any elements; these keep the examples short.
const Choices = () => CHOICES.map((choice) => (
  <DropdownListItem key={choice} label={choice} onSelect={noop} />
));

const Controlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="example-stack">
      <Dropdown label="Account" open={open} onClick={() => setOpen(!open)} onClose={() => setOpen(false)}>
        <Choices />
      </Dropdown>
      <p>The dropdown is {open ? 'open' : 'closed'}.</p>
    </div>
  );
};

const CustomTrigger = () => {
  const [open, setOpen] = useState(false);

  const trigger = (
    <Button variant="primary" onClick={() => setOpen(!open)} aria-haspopup="true" aria-expanded={open}>
      {open ? 'Close menu' : 'Open menu'}
    </Button>
  );

  return (
    <Dropdown buttonComponent={trigger} open={open} onClose={() => setOpen(false)}>
      <Choices />
    </Dropdown>
  );
};

export default {
  name: 'Dropdown',
  description: 'A button that reveals a floating panel of any contents. It opens and closes itself unless you pass open, and a click outside it, a click inside it, or Escape closes it and returns focus to the button.',
  examples: [
    {
      name: 'Opens and closes itself',
      code: `<Dropdown label="Account">
  <DropdownListItem label="Profile" onSelect={handleSelect} />
  <DropdownListItem label="Settings" onSelect={handleSelect} />
  <DropdownListItem label="Sign out" onSelect={handleSelect} />
</Dropdown>`,
      output: (
        <Dropdown label="Account">
          <Choices />
        </Dropdown>
      )
    },
    {
      name: 'Controlled with open',
      code: `const [open, setOpen] = useState(false);

<Dropdown label="Account" open={open} onClick={() => setOpen(!open)} onClose={() => setOpen(false)}>
  <DropdownListItem label="Profile" onSelect={handleSelect} />
  ...
</Dropdown>
<p>The dropdown is {open ? 'open' : 'closed'}.</p>`,
      output: <Controlled />
    },
    {
      name: 'Custom trigger button',
      code: `const [open, setOpen] = useState(false);

<Dropdown
  buttonComponent={
    <Button variant="primary" onClick={() => setOpen(!open)} aria-haspopup="true" aria-expanded={open}>
      {open ? 'Close menu' : 'Open menu'}
    </Button>
  }
  open={open}
  onClose={() => setOpen(false)}
>
  ...
</Dropdown>`,
      output: <CustomTrigger />
    },
    {
      name: 'Panel as wide as the dropdown',
      code: `<Dropdown constrainWidth label="Account">
  <DropdownListItem label="Profile" onSelect={handleSelect} />
  ...
</Dropdown>`,
      output: (
        <Dropdown constrainWidth label="Account">
          <Choices />
        </Dropdown>
      )
    },
    {
      name: 'Without the dimming overlay',
      code: `<Dropdown showOverlay={false} label="Account">
  <DropdownListItem label="Profile" onSelect={handleSelect} />
  ...
</Dropdown>`,
      output: (
        <Dropdown showOverlay={false} label="Account">
          <Choices />
        </Dropdown>
      )
    }
  ]
};
