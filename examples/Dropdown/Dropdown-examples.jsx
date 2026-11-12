import { useState } from 'react';

import Button from '../../components/Button/Button';
import Dropdown from '../../components/Dropdown/Dropdown';
import DropdownListItem from '../../components/DropdownList/DropdownListItem';

const CHOICES = ['Profile', 'Settings', 'Sign out'];

const noop = () => {};

// The contents of a dropdown are any elements; these keep the examples short.
// data-dropdown-close marks a choice: clicking it closes the dropdown.
const Choices = () => CHOICES.map((choice) => (
  <div key={choice} data-dropdown-close>
    <DropdownListItem label={choice} onSelect={noop} />
  </div>
));

// A panel with controls that are used more than once stays open until Done.
const Quantity = () => {
  const [count, setCount] = useState(1);

  return (
    <Dropdown label={`Quantity: ${count}`}>
      <Button aria-label="Fewer" onClick={() => setCount(Math.max(1, count - 1))}>-</Button>
      <span>{count}</span>
      <Button aria-label="More" onClick={() => setCount(count + 1)}>+</Button>
      <Button variant="primary" data-dropdown-close>Done</Button>
    </Dropdown>
  );
};

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
  description: 'A button that reveals a floating panel of any contents, below the button (or above it when there is no room below). It opens and closes itself unless you pass open. A click outside it, Escape, or a click on anything marked data-dropdown-close (a choice) closes it and returns focus to the button; other clicks inside leave it open, so the panel can hold controls that are used more than once. closeOnContentClick closes on any click inside.',
  examples: [
    {
      name: 'Opens and closes itself',
      code: `<Dropdown label="Account">
  <div data-dropdown-close><DropdownListItem label="Profile" onSelect={handleSelect} /></div>
  <div data-dropdown-close><DropdownListItem label="Settings" onSelect={handleSelect} /></div>
  <div data-dropdown-close><DropdownListItem label="Sign out" onSelect={handleSelect} /></div>
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
      name: 'Stays open for controls inside',
      code: `<Dropdown label={'Quantity: ' + count}>
  <Button aria-label="Fewer" onClick={() => setCount(count - 1)}>-</Button>
  <span>{count}</span>
  <Button aria-label="More" onClick={() => setCount(count + 1)}>+</Button>
  <Button variant="primary" data-dropdown-close>Done</Button>
</Dropdown>`,
      output: <Quantity />
    },
    {
      name: 'Closes on any click inside',
      code: `<Dropdown closeOnContentClick label="Account">
  <DropdownListItem label="Profile" onSelect={handleSelect} />
  ...
</Dropdown>`,
      output: (
        <Dropdown closeOnContentClick label="Account">
          {CHOICES.map((choice) => <DropdownListItem key={choice} label={choice} onSelect={noop} />)}
        </Dropdown>
      )
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
      name: 'Dimming the page behind it',
      code: `<Dropdown showOverlay label="Account">
  <DropdownListItem label="Profile" onSelect={handleSelect} />
  ...
</Dropdown>`,
      output: (
        <Dropdown showOverlay label="Account">
          <Choices />
        </Dropdown>
      )
    }
  ]
};
