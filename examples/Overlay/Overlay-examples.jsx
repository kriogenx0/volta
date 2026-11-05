import { useState, useEffect } from 'react';

import Button from '../../components/Button/Button';
import Overlay from '../../components/Overlay/Overlay';

import './Overlay-examples.scss';

const BUSY_MS = 2000;

const Status = ({ showing }) => <p>The overlay is {showing ? 'showing' : 'hidden'}.</p>;

const DismissOnClick = () => {
  const [showing, setShowing] = useState(false);
  return (
    <div className="example-stack">
      <div>
        <Button onClick={() => setShowing(true)}>Dim the page</Button>
      </div>
      <Status showing={showing} />
      <Overlay showing={showing} onClick={() => setShowing(false)} />
    </div>
  );
};

const WithPanel = () => {
  const [showing, setShowing] = useState(false);
  const close = () => setShowing(false);
  return (
    <div className="example-stack">
      <div>
        <Button onClick={() => setShowing(true)}>Show panel</Button>
      </div>
      <Overlay showing={showing} onClick={close} />
      {showing && (
        <div className="example-overlay_panel" role="dialog" aria-label="Panel over the overlay">
          <p>Click the dimmed page, or the button, to dismiss.</p>
          <Button variant="primary" onClick={close}>Close</Button>
        </div>
      )}
    </div>
  );
};

const BlockWhileBusy = () => {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!busy) return undefined;
    const timer = setTimeout(() => setBusy(false), BUSY_MS);
    return () => clearTimeout(timer);
  }, [busy]);

  return (
    <div className="example-stack">
      <div>
        <Button onClick={() => setBusy(true)}>Start a 2 second task</Button>
      </div>
      <Status showing={busy} />
      <Overlay showing={busy} />
    </div>
  );
};

export default {
  name: 'Overlay',
  description: 'A dimming layer over the whole window, added to the page while showing is true. It only draws the dim layer (it renders nothing in place), and calls onClick when the dimmed area is clicked. Put anything that should sit above it in its own positioned element.',
  examples: [
    {
      name: 'Dismiss on click',
      code: `const [showing, setShowing] = useState(false);

<Button onClick={() => setShowing(true)}>Dim the page</Button>
<Overlay showing={showing} onClick={() => setShowing(false)} />`,
      output: <DismissOnClick />
    },
    {
      name: 'With a panel above it',
      code: `<Overlay showing={showing} onClick={close} />
{showing && (
  <div className="my-panel"> {/* position: fixed; z-index above the overlay */}
    <p>Click the dimmed page, or the button, to dismiss.</p>
    <Button onClick={close}>Close</Button>
  </div>
)}`,
      output: <WithPanel />
    },
    {
      name: 'Block the page while busy',
      code: `// No onClick: clicks on the dimmed page do nothing
<Overlay showing={busy} />`,
      output: <BlockWhileBusy />
    }
  ]
};
