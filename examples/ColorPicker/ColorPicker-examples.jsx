import { useState } from 'react';

import ColorPicker from '../../components/ColorPicker/ColorPicker';

const InteractiveColorPicker = () => {
  const [color, setColor] = useState('#4A90E2');

  return (
    <div>
      <ColorPicker value={color} onChange={setColor} />
      <p style={{ color: 'var(--v-color-trim-subtle)', fontSize: 12, marginTop: 10 }}>
        Selected color: {color}
      </p>
    </div>
  );
};

export default {
  name: 'ColorPicker',
  description: 'Choose a color with the native picker, a hex value, or a preset palette.',
  examples: [
    {
      name: 'Interactive color picker',
      code: '<ColorPicker value={color} onChange={setColor} />',
      output: <InteractiveColorPicker />
    }
  ]
};
