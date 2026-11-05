import { useState } from 'react';

import Button from '../../components/Button/Button';
import Layer from '../../components/Layer/Layer';

import './Layer-examples.scss';

const Basic = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="example-stack">
      <div>
        <Button onClick={() => setOpen(true)}>Open layer</Button>
      </div>
      {open && (
        <Layer>
          <div className="example-layer_panel" role="dialog" aria-label="Layer">
            <p>This panel is rendered into a node at the end of the page, not inside this example.</p>
            <Button variant="primary" onClick={() => setOpen(false)}>Close</Button>
          </div>
        </Layer>
      )}
    </div>
  );
};

const Stacking = () => {
  const [first, setFirst] = useState(false);
  const [second, setSecond] = useState(false);
  return (
    <div className="example-stack">
      <div>
        <Button onClick={() => setFirst(true)}>Open first layer</Button>{' '}
        <Button onClick={() => setSecond(true)}>Open second layer</Button>
      </div>
      <p>Open one, then the other: the one opened last is on top, whichever it is.</p>
      {first && (
        <Layer>
          <div className="example-layer_panel" role="dialog" aria-label="First layer">
            <p>First layer</p>
            <Button onClick={() => setFirst(false)}>Close first</Button>
          </div>
        </Layer>
      )}
      {second && (
        <Layer>
          <div className="example-layer_panel example-layer_panel--second" role="dialog" aria-label="Second layer">
            <p>Second layer</p>
            <Button onClick={() => setSecond(false)}>Close second</Button>
          </div>
        </Layer>
      )}
    </div>
  );
};

const Bubbling = () => {
  const [open, setOpen] = useState(false);
  const [clicks, setClicks] = useState(0);
  return (
    <div className="example-stack">
      <div>
        <Button onClick={() => setOpen(true)}>Open layer</Button>
      </div>
      <p>Clicks that bubbled up to the parent: {clicks}</p>
      {/* This wrapper holds only the Layer, so it only ever hears clicks that
          bubble out of it: React events cross a portal to the component that
          rendered the Layer. */}
      <div onClick={() => setClicks((n) => n + 1)}>
        {open && (
          <Layer>
            <div className="example-layer_panel" role="dialog" aria-label="Bubbling layer">
              <p>These buttons are outside this example in the DOM.</p>
              <Button onClick={() => setOpen(false)}>Close (bubbles)</Button>{' '}
              <Button onClick={(e) => e.stopPropagation()}>Stopped</Button>
            </div>
          </Layer>
        )}
      </div>
    </div>
  );
};

export default {
  name: 'Layer',
  description: 'Renders its children into a new element at the end of the page (a portal), so they escape any clipping or stacking of the place they are written. Layers stack in the order they mount. React events still bubble to the component that rendered the Layer.',
  examples: [
    {
      name: 'Render into the page',
      code: `{open && (
  <Layer>
    <div className="my-panel"> {/* position: fixed */}
      <Button onClick={() => setOpen(false)}>Close</Button>
    </div>
  </Layer>
)}`,
      output: <Basic />
    },
    {
      name: 'Stacking order',
      code: `{first && <Layer><PanelOne /></Layer>}
{second && <Layer><PanelTwo /></Layer>}`,
      output: <Stacking />
    },
    {
      name: 'Events bubble through the portal',
      code: `<div onClick={countClick}>
  <Layer>
    <Button onClick={close}>Close (bubbles)</Button>
    <Button onClick={(e) => e.stopPropagation()}>Stopped</Button>
  </Layer>
</div>`,
      output: <Bubbling />
    }
  ]
};
