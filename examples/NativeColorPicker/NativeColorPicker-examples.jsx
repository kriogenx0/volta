import { useState } from 'react';

import NativeColorPicker from '../../components/NativeColorPicker/NativeColorPicker';

const Controlled = () => {
  const [color, setColor] = useState('#4A90E2');

  return (
    <div className="example-stack">
      <NativeColorPicker value={color} onChange={setColor} />
      <p>Selected color: {color}</p>
    </div>
  );
};

export default {
  name: 'NativeColorPicker',
  description: "The browser's own colour chooser, styled like the other fields. ColorPicker uses it by default.",
  examples: [
    {
      name: 'Controlled with state',
      code: `const [color, setColor] = useState('#4A90E2');

<NativeColorPicker value={color} onChange={setColor} />`,
      output: <Controlled />
    },
    {
      name: 'Disabled',
      code: '<NativeColorPicker value="#9060F0" disabled />',
      output: <NativeColorPicker value="#9060F0" disabled />
    }
  ]
};
