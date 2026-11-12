import { useState } from 'react';

import TextboxDropdown from '../../components/TextboxDropdown/TextboxDropdown';
import TextBox from '../../components/TextBox/TextBox';
import List from '../../components/List/List';
import Button from '../../components/Button/Button';

const FRUIT = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango', 'Orange'];

// A list of suggestions under a textbox that filters as you type; choosing one fills the box
const Suggestions = () => {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const matches = FRUIT.filter((name) => name.toLowerCase().includes(value.trim().toLowerCase()));

  const choose = (name) => {
    setValue(name);
    setOpen(false);
  };

  return (
    <TextboxDropdown
      open={open}
      onOpenChange={setOpen}
      panelRole="listbox"
      panelLabel="Fruit"
      textbox={<TextBox label="Fruit" value={value} placeholder="Type a fruit" onChange={(event) => { setValue(event.target.value); setOpen(true); }} />}
    >
      {matches.length
        ? <List items={matches.map((name) => ({ label: name, action: () => choose(name) }))} />
        : <p className="example-note">No fruit matches.</p>}
    </TextboxDropdown>
  );
};

// Any content can hang from the box: here a few quick choices and a button, opening by itself
const Quick = () => {
  const [value, setValue] = useState('');
  return (
    <TextboxDropdown
      panelLabel="Quick choices"
      textbox={<TextBox label="Deadline" value={value} placeholder="Pick or type a date" onChange={(event) => setValue(event.target.value)} />}
    >
      <div className="example-stack">
        {['Today', 'Tomorrow', 'Next week'].map((label) => (
          <Button key={label} variant="link" data-dropdown-close onClick={() => setValue(label)}>{label}</Button>
        ))}
      </div>
    </TextboxDropdown>
  );
};

export default {
  name: 'TextboxDropdown',
  description: 'A textbox with a panel under it, as wide as the box. It opens when the box gets focus or is clicked, and closes on Escape, a click outside, or when focus leaves the box and the panel. It is the shared part of fields that offer choices: pass the field as textbox and the panel as children, and control it with open and onOpenChange or let it manage itself.',
  examples: [
    {
      name: 'Suggestions that filter as you type',
      code: `const [value, setValue] = useState('');
const [open, setOpen] = useState(false);

<TextboxDropdown
  open={open}
  onOpenChange={setOpen}
  panelRole="listbox"
  panelLabel="Fruit"
  textbox={<TextBox label="Fruit" value={value} onChange={(e) => { setValue(e.target.value); setOpen(true); }} />}
>
  <List items={matches.map((name) => ({ label: name, action: () => choose(name) }))} />
</TextboxDropdown>`,
      output: <Suggestions />
    },
    {
      name: 'Any content, opening by itself',
      code: `<TextboxDropdown textbox={<TextBox label="Deadline" value={value} onChange={...} />}>
  <Button variant="link" data-dropdown-close onClick={() => setValue('Today')}>Today</Button>
</TextboxDropdown>`,
      output: <Quick />
    }
  ]
};
