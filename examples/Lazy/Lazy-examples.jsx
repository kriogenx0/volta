import { useState } from 'react';

import Button from '../../components/Button/Button';
import Lazy from '../../components/Lazy/Lazy';
import Loader from '../../components/Loader/Loader';

import './Lazy-examples.scss';

const OnScroll = () => (
  <div className="example-lazy_scroll">
    <div className="example-lazy_spacer">Scroll down</div>
    <Lazy minHeight={64}>
      <div className="example-lazy_content">Loaded when it scrolled into view.</div>
    </Lazy>
  </div>
);

const WithPlaceholder = () => (
  <div className="example-lazy_scroll">
    <div className="example-lazy_spacer">Scroll down</div>
    <Lazy minHeight={64} placeholder={<Loader size="small" message="Loading" />}>
      <div className="example-lazy_content">Replaces the loader.</div>
    </Lazy>
  </div>
);

const OnDemand = () => {
  const [load, setLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="example-stack">
      <div>
        <Button onClick={() => setLoad(true)} disabled={load}>Load now</Button>
      </div>
      <div className="example-lazy_scroll">
        <div className="example-lazy_spacer">Far from the top of this box</div>
        <Lazy minHeight={64} load={load} onLoad={() => setLoaded(true)}>
          <div className="example-lazy_content">Loaded without scrolling.</div>
        </Lazy>
      </div>
      <p>{loaded ? 'onLoad was called' : 'Not loaded yet'}</p>
    </div>
  );
};

export default {
  name: 'Lazy',
  description: 'Holds back its children until they are near the screen, then shows them and keeps them. Use minHeight to keep the page from jumping and placeholder to show a loader in the meantime. load forces it to show now.',
  examples: [
    {
      name: 'Loads when scrolled into view',
      code: `<Lazy minHeight={64}>
  <div>Loaded when it scrolled into view.</div>
</Lazy>`,
      output: <OnScroll />
    },
    {
      name: 'With a placeholder',
      code: `<Lazy minHeight={64} placeholder={<Loader size="small" message="Loading" />}>
  <div>Replaces the loader.</div>
</Lazy>`,
      output: <WithPlaceholder />
    },
    {
      name: 'Load on demand',
      code: `const [load, setLoad] = useState(false);

<Button onClick={() => setLoad(true)}>Load now</Button>
<Lazy minHeight={64} load={load} onLoad={() => setLoaded(true)}>
  <div>Loaded without scrolling.</div>
</Lazy>`,
      output: <OnDemand />
    }
  ]
};
