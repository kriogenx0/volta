import { useState } from 'react';

import Slider from '../../components/Slider/Slider';

const Controlled = () => {
  const [volume, setVolume] = useState(30);
  return (
    <div>
      <Slider ariaLabel="Volume" min={0} max={100} value={volume} onChange={setVolume} />
      <p>Volume: {Math.round(volume)}</p>
    </div>
  );
};

const Stepped = () => {
  const [stars, setStars] = useState(3);
  return (
    <div>
      <Slider ariaLabel="Rating" min={1} max={5} step={1} value={stars} onChange={setStars} />
      <p>Rating: {stars} of 5</p>
    </div>
  );
};

export default {
  name: 'Slider',
  description: 'Drag the thumb, click the track, or use the arrow, Home, End and Page keys. Controlled (value + onChange) or uncontrolled.',
  examples: [
    {
      name: 'Slider',
      code: '<Slider ariaLabel="Amount" />',
      output: <Slider ariaLabel="Amount" />
    },
    {
      name: 'Controlled, 0 to 100',
      code: `const [volume, setVolume] = useState(30);

<Slider ariaLabel="Volume" min={0} max={100} value={volume} onChange={setVolume} />`,
      output: <Controlled />
    },
    {
      name: 'Snapping to steps',
      code: `const [stars, setStars] = useState(3);

<Slider ariaLabel="Rating" min={1} max={5} step={1} value={stars} onChange={setStars} />`,
      output: <Stepped />
    },
    {
      name: 'Disabled',
      code: '<Slider ariaLabel="Locked" disabled defaultValue={1.5} />',
      output: <Slider ariaLabel="Locked" disabled defaultValue={1.5} />
    }
  ]
};
