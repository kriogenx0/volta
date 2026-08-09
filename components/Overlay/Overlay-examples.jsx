import { useState } from 'react';
import Overlay from './Overlay';
import Button from '../Button';

const OverlayExample = () => {
  const [showing, setShowing] = useState(false);
  return (
    <div>
      <Button onClick={() => setShowing(true)}>Show Overlay</Button>
      <Overlay showing={showing} onClick={() => setShowing(false)} />
      {showing && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50)', zIndex: 1000, background: '#fff', padding: 24, borderRadius: 8 }}>
          <p>Click outside to dismiss.</p>
          <Button onClick={() => setShowing(false)}>Close</Button>
        </div>
      )}
    </div>
  );
};

export default {
  name: 'Overlay',
  description: 'A full-screen dimming overlay, typically used behind modals and drawers.',
  examples: [
    {
      name: 'Overlay',
      code: `<Overlay showing={showing} onClick={() => setShowing(false)} />`,
      output: <OverlayExample />
    },
  ]
};
