import { useState } from 'react';

import ColorPicker, { ColorPalettePicker } from '../../components/ColorPicker/ColorPicker';

const BRAND_PALETTE = ['#4A90E2', '#50E3C2', '#F0B460', '#F06060', '#9060F0', '#000000'];

const Controlled = () => {
  const [color, setColor] = useState('#4A90E2');

  return (
    <div className="example-stack">
      <ColorPicker value={color} onChange={setColor} />
      <p>Selected color: {color}</p>
    </div>
  );
};

const WithStartingColor = () => {
  const [last, setLast] = useState('none yet');

  return (
    <div className="example-stack">
      <ColorPicker initialValue="#9060F0" onValueChange={setLast} />
      <p>Last change: {last}</p>
    </div>
  );
};

const PopoverControlled = () => {
  const [color, setColor] = useState('#4A90E2');

  return (
    <div className="example-stack">
      <ColorPicker popover value={color} onChange={setColor} />
      <p>Selected color: {color}</p>
    </div>
  );
};

export default {
  name: 'ColorPicker',
  description: 'Choose a color with the native picker, a typed hex value (or color name), or a row of preset swatches. Control it with value and onChange, or let it keep its own state from initialValue. show picks the picker (chooser and text box), the palette, or both (the default). With popover the palette opens from a swatch button instead of always showing. ColorPalettePicker is the popover form with 20 presets.',
  examples: [
    {
      name: 'Controlled with state',
      code: `const [color, setColor] = useState('#4A90E2');

<ColorPicker value={color} onChange={setColor} />`,
      output: <Controlled />
    },
    {
      name: 'Starting color and change callback',
      code: `<ColorPicker initialValue="#9060F0" onValueChange={(hex) => console.log(hex)} />`,
      output: <WithStartingColor />
    },
    {
      name: 'Custom palette',
      code: `<ColorPicker
  initialValue="#50E3C2"
  palette={['#4A90E2', '#50E3C2', '#F0B460', '#F06060', '#9060F0', '#000000']}
/>`,
      output: <ColorPicker initialValue="#50E3C2" palette={BRAND_PALETTE} />
    },
    {
      name: 'Named form field',
      code: '<ColorPicker name="brand_color" aria-label="Brand color hex" initialValue="#F06060" />',
      output: <ColorPicker name="brand_color" aria-label="Brand color hex" initialValue="#F06060" />
    },
    {
      name: 'Only the picker, or only the palette',
      code: `<ColorPicker show="picker" initialValue="#4A90E2" />
<ColorPicker show="palette" initialValue="#4A90E2" />`,
      output: (
        <div className="example-stack">
          <ColorPicker show="picker" initialValue="#4A90E2" />
          <ColorPicker show="palette" initialValue="#4A90E2" />
        </div>
      )
    },
    {
      name: 'Palette in a popover',
      code: `const [color, setColor] = useState('#4A90E2');

<ColorPicker popover value={color} onChange={setColor} />`,
      output: <PopoverControlled />
    },
    {
      name: 'ColorPalettePicker',
      code: '<ColorPalettePicker initialValue="#9060F0" />',
      output: <ColorPalettePicker initialValue="#9060F0" />
    }
  ]
};
