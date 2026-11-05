import { useState } from 'react';

import ColorPalettePicker from '../../components/ColorPalettePicker/ColorPalettePicker';

const Controlled = () => {
  const [color, setColor] = useState('#4A90E2');

  return (
    <div className="example-stack">
      <ColorPalettePicker value={color} onChange={setColor} />
      <p>Selected color: {color || 'none'}</p>
    </div>
  );
};

const StartsEmpty = () => {
  const [picked, setPicked] = useState('nothing yet');

  return (
    <div className="example-stack">
      <ColorPalettePicker onChange={setPicked} />
      <p>Last change: {picked || 'cleared'}</p>
    </div>
  );
};

export default {
  name: 'ColorPalettePicker',
  description: 'A text box for a color with a swatch button that opens a palette of preset colors. onChange reports both typed text and chosen swatches; any CSS color string works.',
  examples: [
    {
      name: 'Controlled with state',
      code: `const [color, setColor] = useState('#4A90E2');

<ColorPalettePicker value={color} onChange={setColor} />`,
      output: <Controlled />
    },
    {
      name: 'Starting empty',
      code: '<ColorPalettePicker onChange={(color) => console.log(color)} />',
      output: <StartsEmpty />
    },
    {
      name: 'Starting from a color',
      code: '<ColorPalettePicker value="#9060F0" />',
      output: <ColorPalettePicker value="#9060F0" />
    }
  ]
};
