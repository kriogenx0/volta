import { useState } from 'react';

import Dropdown from './Dropdown';

const DropdownExample = () => {
  const [open, setOpen] = useState(false);

  const onClick = () => {
    setOpen(!open);
  };

  return (
    <Dropdown label='Test Dropdown' open={open} onClick={onClick} onClose={onClick}>
      <div onClick={onClick} style={{ padding: 10, color: '#000', cursor: 'pointer' }}>Test Dropdown Contents</div>
    </Dropdown>
  );
};

export default {
  name: 'Dropdown',
  description: 'A dropdown without anything else',
  examples: [
    {
      name: 'Dropdown',
      code: (
        '<Dropdown>Test Dropdown</Dropdown>'
      ),
      output: (
        <Dropdown label='Test Dropdown'>Test Dropdown Contents</Dropdown>
      )
    },

    {
      name: 'Dropdown',
      code: (
        '<Dropdown label="Test Dropdown" open={open} onClick={onClick}>Test Dropdown Contents</Dropdown>'
      ),
      output: (
        <DropdownExample />
      )
    }
  ]
};
