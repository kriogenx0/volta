import { useEffect, useState } from 'react';

import Button from '../../components/Button/Button';
import Slider from '../../components/Slider/Slider';
import { resetAnimationSpeed, setAnimationSpeed } from '../../components/theme';

import './Slider-examples.scss';

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

const DEFAULT_SPEED = 150;

// Sets the library-wide animation speed (Theme.setAnimationSpeed) as the slider moves,
// and shows it on a box that slides when the button is pressed. The slider itself
// glides to a clicked place at this speed too. Leaving the example puts the speed back.
const AnimationSpeed = () => {
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [right, setRight] = useState(false);

  useEffect(() => resetAnimationSpeed, []);

  const change = (ms) => {
    setSpeed(ms);
    setAnimationSpeed(ms);
  };

  const reset = () => {
    setSpeed(DEFAULT_SPEED);
    resetAnimationSpeed();
  };

  return (
    <div className="example-stack">
      <Slider ariaLabel="Animation speed" min={0} max={1000} step={10} value={speed} onChange={change} />
      <p className="example-note">Animation speed: {speed} ms</p>
      <div className="example-slider_stage">
        <div className={`example-slider_box${right ? ' example-slider_box--right' : ''}`} />
      </div>
      <div className="example-row">
        <Button onClick={() => setRight(!right)}>Slide the box</Button>
        <Button onClick={reset}>Reset to {DEFAULT_SPEED} ms</Button>
      </div>
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
    },
    {
      name: 'Animation speed',
      code: `const [speed, setSpeed] = useState(150);

<Slider
  ariaLabel="Animation speed"
  min={0}
  max={1000}
  step={10}
  value={speed}
  onChange={(ms) => { setSpeed(ms); Theme.setAnimationSpeed(ms); }}
/>`,
      output: <AnimationSpeed />
    }
  ]
};
