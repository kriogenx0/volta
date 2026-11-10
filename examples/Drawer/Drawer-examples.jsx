import { useState } from 'react';

import Button from '../../components/Button/Button';
import Drawer from '../../components/Drawer/Drawer';

import './Drawer-examples.scss';

// A button that opens a drawer inside a framed box. Anything else is passed
// through to the Drawer (width, label).
const DrawerDemo = ({ startOpen = false, title = 'Drawer title', children, ...drawerProps }) => {
  const [open, setOpen] = useState(startOpen);
  return (
    <div className="example-stack">
      <div>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
      </div>
      <div className="example-drawer_frame">
        <p className="example-drawer_page">The page behind the drawer.</p>
        <Drawer open={open} onClose={() => setOpen(false)} {...drawerProps}>
          <div className="example-drawer_content">
            <h3>{title}</h3>
            {children || <p>Click the dimmed page or press Escape to close.</p>}
            <Button variant="primary" onClick={() => setOpen(false)}>Done</Button>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default {
  name: 'Drawer',
  description: 'A panel that slides in from an edge of its nearest positioned ancestor, over a dimmed scrim: the right edge by default, or the left, top or bottom with edge (named as SwiftUI names an Edge: leading, trailing, top, bottom). The parent owns the open state: onClose fires when the scrim is clicked or Escape is pressed.',
  examples: [
    {
      name: 'Open and close',
      code: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open drawer</Button>
<Drawer open={open} onClose={() => setOpen(false)}>
  <h3>Drawer title</h3>
  <Button onClick={() => setOpen(false)}>Done</Button>
</Drawer>`,
      output: <DrawerDemo />
    },
    {
      name: 'Fixed width',
      code: `<Drawer open={open} width="320px" onClose={() => setOpen(false)}>
  ...
</Drawer>`,
      output: <DrawerDemo width="320px" title="Narrow drawer"><p>A drawer 320px wide.</p></DrawerDemo>
    },
    {
      name: 'Wide drawer with a label',
      code: `<Drawer open={open} width="80%" label="Order details" onClose={() => setOpen(false)}>
  ...
</Drawer>`,
      output: <DrawerDemo width="80%" label="Order details" title="Order details"><p>Wider than the default 50%, and it slides fully out of view when closed.</p></DrawerDemo>
    },
    {
      name: 'Open on load',
      code: `const [open, setOpen] = useState(true);

<Drawer open={open} onClose={() => setOpen(false)}>
  ...
</Drawer>`,
      output: <DrawerDemo startOpen title="Already open" />
    },
    {
      name: 'A bottom drawer',
      code: `<Drawer open={open} edge="bottom" height="60%" label="Share" onClose={() => setOpen(false)}>
  ...
</Drawer>`,
      output: <DrawerDemo edge="bottom" height="60%" label="Share" title="Bottom drawer"><p>Slides up from the bottom edge, with rounded top corners.</p></DrawerDemo>
    },
    {
      name: 'From the left, or from the top',
      code: `<Drawer open={open} edge="leading" width="260px" onClose={...}>...</Drawer>
<Drawer open={open} edge="top" height="40%" onClose={...}>...</Drawer>`,
      output: (
        <div className="example-stack">
          <DrawerDemo edge="leading" width="260px" title="Leading drawer"><p>From the left edge.</p></DrawerDemo>
          <DrawerDemo edge="top" height="45%" title="Top drawer"><p>From the top edge.</p></DrawerDemo>
        </div>
      )
    }
  ]
};
