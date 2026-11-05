import { useState } from 'react';

import IconButton from '../../components/IconButton/IconButton';

// IconButton takes an icon *component* and renders it as <Icon size={16} />, so any
// icon set whose components accept a `size` prop works. These draw with currentColor,
// which lets the button's hover colour show through.
const iconProps = {
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true
};

const PlusIcon = ({ size }) => (
  <svg width={size} height={size} {...iconProps}><path d="M8 3v10M3 8h10" /></svg>
);

const TrashIcon = ({ size }) => (
  <svg width={size} height={size} {...iconProps}><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.5 8.5h6l.5-8.5" /></svg>
);

const StarIcon = ({ size }) => (
  <svg width={size} height={size} {...iconProps}><path d="M8 2l1.8 3.8 4.2.5-3.1 2.9.8 4.1L8 11.3 4.3 13.3l.8-4.1L2 6.3l4.2-.5z" /></svg>
);

const ICON_CODE = `const PlusIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 3v10M3 8h10" />
  </svg>
);`;

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <IconButton icon={PlusIcon} label="Add one" onClick={() => setCount(count + 1)} />
      {' '}
      <IconButton icon={TrashIcon} label="Reset" variant="danger" disabled={count === 0} onClick={() => setCount(0)} />
      <p>Count: {count}</p>
    </div>
  );
};

const Favorite = () => {
  const [on, setOn] = useState(false);
  return (
    <div>
      <IconButton icon={StarIcon} label={on ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={on} onClick={() => setOn(!on)} />
      <p>{on ? 'Favorited' : 'Not a favorite'}</p>
    </div>
  );
};

export default {
  name: 'IconButton',
  description: 'A borderless button that shows only an icon. Pass the icon as a component (it is rendered with a size prop) and a label, which becomes the aria-label and tooltip. Variants: ghost (default) and danger.',
  examples: [
    {
      name: 'Ghost (default)',
      code: `${ICON_CODE}

<IconButton icon={PlusIcon} label="Add item" onClick={handleAdd} />`,
      output: <IconButton icon={PlusIcon} label="Add item" onClick={() => {}} />
    },
    {
      name: 'Danger variant',
      code: '<IconButton icon={TrashIcon} label="Delete item" variant="danger" onClick={handleDelete} />',
      output: <IconButton icon={TrashIcon} label="Delete item" variant="danger" onClick={() => {}} />
    },
    {
      name: 'Sizes',
      code: `<IconButton icon={StarIcon} label="Small" size={12} />
<IconButton icon={StarIcon} label="Default" />
<IconButton icon={StarIcon} label="Large" size={24} />
<IconButton icon={StarIcon} label="Extra large" size={32} />`,
      output: (
        <div>
          <IconButton icon={StarIcon} label="Small" size={12} />
          {' '}
          <IconButton icon={StarIcon} label="Default" />
          {' '}
          <IconButton icon={StarIcon} label="Large" size={24} />
          {' '}
          <IconButton icon={StarIcon} label="Extra large" size={32} />
        </div>
      )
    },
    {
      name: 'Disabled',
      code: '<IconButton icon={PlusIcon} label="Add item" disabled />',
      output: <IconButton icon={PlusIcon} label="Add item" disabled />
    },
    {
      name: 'With state',
      code: `const [count, setCount] = useState(0);

<IconButton icon={PlusIcon} label="Add one" onClick={() => setCount(count + 1)} />
<IconButton icon={TrashIcon} label="Reset" variant="danger" disabled={count === 0} onClick={() => setCount(0)} />
<p>Count: {count}</p>`,
      output: <Counter />
    },
    {
      name: 'Toggle',
      code: `const [on, setOn] = useState(false);

<IconButton
  icon={StarIcon}
  label={on ? 'Remove from favorites' : 'Add to favorites'}
  aria-pressed={on}
  onClick={() => setOn(!on)}
/>`,
      output: <Favorite />
    }
  ]
};
