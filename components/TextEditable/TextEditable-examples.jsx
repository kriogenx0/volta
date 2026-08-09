import { useState } from 'react';
import TextEditable from './TextEditable';

const TextEditableExample = () => {
  const [value, setValue] = useState('Click to edit this text');
  return (
    <div>
      <TextEditable value={value} onChange={setValue} />
      <p style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
        Current value: {value}
      </p>
    </div>
  );
};

const TextEditableHeadingExample = () => {
  const [title, setTitle] = useState('Editable Heading');
  return <TextEditable tagName="h3" value={title} onChange={setTitle} />;
};

export default {
  name: 'TextEditable',
  description: 'A contentEditable element — click to edit text inline.',
  examples: [
    {
      name: 'Inline editable text',
      code: `<TextEditable value={value} onChange={setValue} />`,
      output: <TextEditableExample />
    },
    {
      name: 'Editable heading',
      code: `<TextEditable tagName="h3" value={title} onChange={setTitle} />`,
      output: <TextEditableHeadingExample />
    },
  ]
};
