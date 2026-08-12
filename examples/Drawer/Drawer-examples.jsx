import { useState } from 'react';
import Drawer from '../../components/Drawer/Drawer';
import Button from '../../components/Button/Button';

const DrawerExample = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <div style={{ padding: 24 }}>
          <h3>Drawer Title</h3>
          <p>Drawer content goes here. Click outside to close.</p>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </Drawer>
    </div>
  );
};

export default {
  name: 'Drawer',
  description: 'A sliding panel that overlays the page from the side.',
  examples: [
    {
      name: 'Drawer',
      code: `<Drawer open={open} onClose={() => setOpen(false)}>
  <div style={{ padding: 24 }}>Drawer content</div>
</Drawer>`,
      output: <DrawerExample />
    },
  ]
};
