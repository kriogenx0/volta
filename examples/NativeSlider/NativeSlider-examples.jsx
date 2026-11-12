import { useState } from 'react';

import NativeSlider from '../../components/NativeSlider/NativeSlider';

const Controlled = () => {
  const [speed, setSpeed] = useState(150);
  return (
    <div className="example-stack">
      <NativeSlider aria-label="Animation speed" min={0} max={500} step={10} value={speed} onChange={setSpeed} />
      <p>{speed} ms</p>
    </div>
  );
};

export default {
  name: 'NativeSlider',
  description: "The browser's own range input, styled like Slider. It keeps the browser's keyboard, touch and screen reader behaviour; onChange gets the number.",
  examples: [
    {
      name: 'Controlled with state',
      code: `const [speed, setSpeed] = useState(150);

<NativeSlider aria-label="Animation speed" min={0} max={500} step={10} value={speed} onChange={setSpeed} />`,
      output: <Controlled />
    },
    {
      name: 'Uncontrolled',
      code: '<NativeSlider aria-label="Volume" defaultValue={30} />',
      output: <NativeSlider aria-label="Volume" defaultValue={30} />
    },
    {
      name: 'Disabled',
      code: '<NativeSlider aria-label="Locked" value={60} disabled />',
      output: <NativeSlider aria-label="Locked" value={60} disabled onChange={() => {}} />
    }
  ]
};
