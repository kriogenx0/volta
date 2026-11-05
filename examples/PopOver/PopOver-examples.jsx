import { useState } from 'react';

import Button from '../../components/Button/Button';
import PopOver from '../../components/PopOver/PopOver';

import './PopOver-examples.scss';

const FullSize = ({ closeOnOverlayClick, label }) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open popover</Button>
      <PopOver open={open} closeOnOverlayClick={closeOnOverlayClick} handleClose={close} aria-label={label}>
        <div className="example-pop_over_card">
          <h3>{label}</h3>
          <p>
            {closeOnOverlayClick
              ? 'Click outside this card or press Escape to close.'
              : 'Clicking outside does nothing; use the button.'}
          </p>
          <Button variant="primary" onClick={close}>Close</Button>
        </div>
      </PopOver>
    </div>
  );
};

const InPlace = () => {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState('none');
  const pick = (name) => {
    setPicked(name);
    setOpen(false);
  };
  return (
    <div>
      <Button onClick={() => setOpen(!open)}>Sort by</Button>
      <p>Picked: {picked}</p>
      <PopOver open={open} fullSize={false} handleClose={() => setOpen(false)} aria-label="Sort by">
        <div className="example-pop_over_menu">
          <Button variant="link" onClick={() => pick('Name')}>Name</Button>
          <Button variant="link" onClick={() => pick('Date')}>Date</Button>
          <Button variant="link" onClick={() => pick('Size')}>Size</Button>
        </div>
      </PopOver>
    </div>
  );
};

export default {
  name: 'PopOver',
  description: 'A panel shown over the page while open. By default a translucent backdrop covers the window; fullSize={false} keeps the content in place. The parent owns the open state: handleClose fires on a click outside the content and on Escape (when closeOnOverlayClick is on).',
  examples: [
    {
      name: 'Full size (default)',
      code: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open popover</Button>
<PopOver open={open} handleClose={() => setOpen(false)} aria-label="Settings">
  <div className="my-card">
    <h3>Settings</h3>
    <Button onClick={() => setOpen(false)}>Close</Button>
  </div>
</PopOver>`,
      output: <FullSize closeOnOverlayClick label="Settings" />
    },
    {
      name: 'Only the button closes it',
      code: `<PopOver open={open} closeOnOverlayClick={false} handleClose={() => setOpen(false)}>
  ...
</PopOver>`,
      output: <FullSize closeOnOverlayClick={false} label="Confirm changes" />
    },
    {
      name: 'In place (fullSize off)',
      code: `<PopOver open={open} fullSize={false} handleClose={() => setOpen(false)}>
  <div className="my-menu">
    <Button variant="link" onClick={() => pick('Name')}>Name</Button>
    ...
  </div>
</PopOver>`,
      output: <InPlace />
    }
  ]
};
