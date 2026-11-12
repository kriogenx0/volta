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
  description: 'Choose a color. By default it is a text box with a swatch button that opens the palette (and the picker); popover={false} lays the picker and the palette out in the page instead. Choose with the native picker, a typed hex value (or color name), or a row of preset swatches. picker chooses the colour chooser: the native browser chooser (native, the default) or Volta\'s own square and hue slider (custom). Control it with value and onChange, or let it keep its own state from initialValue. show picks the picker (chooser and text box), the palette, or both (the default). With popover the palette opens from a swatch button instead of always showing. ColorPalettePicker is the popover form with 20 presets.',
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
      name: 'Its own picker',
      code: `<ColorPicker popover={false} picker="custom" initialValue="#4A90E2" />`,
      output: <ColorPicker popover={false} picker="custom" initialValue="#4A90E2" />
    },
    {
      name: 'Its own picker in a popover (the default)',
      code: `<ColorPicker picker="custom" initialValue="#9060F0" />`,
      output: <ColorPicker picker="custom" initialValue="#9060F0" />
    },
    {
      name: 'RGB and HSL',
      code: `<ColorPicker format="rgb" initialValue="#4A90E2" />
<ColorPicker format="hsl" initialValue="#4A90E2" />`,
      output: (
        <div className="example-stack">
          <ColorPicker format="rgb" initialValue="#4A90E2" />
          <ColorPicker format="hsl" initialValue="#4A90E2" />
        </div>
      )
    },
    {
      name: 'The swatch on the right',
      code: `<ColorPicker popover={false} side="right" initialValue="#50E3C2" />
<ColorPicker popover side="left" initialValue="#50E3C2" />`,
      output: (
        <div className="example-stack">
          <ColorPicker popover={false} side="right" initialValue="#50E3C2" />
          <ColorPicker popover side="left" initialValue="#50E3C2" />
        </div>
      )
    },
    {
      name: 'No text box',
      code: `<ColorPicker textbox={false} show="picker" initialValue="#F06060" />
<ColorPicker popover={false} textbox={false} picker="custom" initialValue="#F06060" />
<ColorPicker textbox={false} initialValue="#F06060" />`,
      output: (
        <div className="example-stack">
          <ColorPicker textbox={false} show="picker" initialValue="#F06060" />
          <ColorPicker popover={false} textbox={false} picker="custom" initialValue="#F06060" />
          <ColorPicker textbox={false} initialValue="#F06060" />
        </div>
      )
    },
    {
      name: 'Custom palette',
      code: `<ColorPicker
  popover={false}
  initialValue="#50E3C2"
  palette={['#4A90E2', '#50E3C2', '#F0B460', '#F06060', '#9060F0', '#000000']}
/>`,
      output: <ColorPicker popover={false} initialValue="#50E3C2" palette={BRAND_PALETTE} />
    },
    {
      name: 'Named form field',
      code: '<ColorPicker name="brand_color" aria-label="Brand color hex" initialValue="#F06060" />',
      output: <ColorPicker name="brand_color" aria-label="Brand color hex" initialValue="#F06060" />
    },
    {
      name: 'Only the picker, or only the palette',
      code: `<ColorPicker popover={false} show="picker" initialValue="#4A90E2" />
<ColorPicker popover={false} show="palette" initialValue="#4A90E2" />`,
      output: (
        <div className="example-stack">
          <ColorPicker popover={false} show="picker" initialValue="#4A90E2" />
          <ColorPicker popover={false} show="palette" initialValue="#4A90E2" />
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
