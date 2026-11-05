import { useState } from 'react';

import Textarea from '../../components/Textarea/Textarea';

const MAX_LENGTH = 140;

const CountedTextarea = () => {
  const [text, setText] = useState('');

  return (
    <div>
      <Textarea
        label="Message"
        placeholder="Say something"
        maxLength={MAX_LENGTH}
        rows={3}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <p>{text.length} / {MAX_LENGTH} characters</p>
    </div>
  );
};

export default {
  name: 'Textarea',
  description: 'Multi line text input built on TextField, so it takes the same label, optional, fieldSize and error props. Use resize to choose which way the corner handle drags, and height for a fixed size.',
  examples: [
    {
      name: 'Textarea',
      code: '<Textarea placeholder="Write something..." rows={4} />',
      output: <Textarea placeholder="Write something..." rows={4} />
    },
    {
      name: 'Controlled with a character count',
      code: `const [text, setText] = useState('');

<Textarea
  label="Message"
  placeholder="Say something"
  maxLength={140}
  rows={3}
  value={text}
  onChange={(event) => setText(event.target.value)}
/>
<p>{text.length} / 140 characters</p>`,
      output: <CountedTextarea />
    },
    {
      name: 'Resize directions',
      code: `<Textarea resize="both" rows={2} defaultValue="Resizable both ways (default)" />
<Textarea resize="y" rows={2} defaultValue="Resizable up and down" />
<Textarea resize="none" rows={2} defaultValue="Fixed size" />`,
      output: (
        <div className="example-stack">
          <Textarea resize="both" rows={2} defaultValue="Resizable both ways (default)" />
          <Textarea resize="y" rows={2} defaultValue="Resizable up and down" />
          <Textarea resize="none" rows={2} defaultValue="Fixed size" />
        </div>
      )
    },
    {
      name: 'Fixed height',
      code: '<Textarea height={160} resize="none" placeholder="160px tall" />',
      output: <Textarea height={160} resize="none" placeholder="160px tall" />
    },
    {
      name: 'Optional, disabled and error states',
      code: `<Textarea label="Bio" optional rows={2} />
<Textarea label="Locked notes" disabled rows={2} defaultValue="Read only for now" />
<Textarea label="Reason" rows={2} error="A reason is required" />`,
      output: (
        <div className="example-stack">
          <Textarea label="Bio" optional rows={2} />
          <Textarea label="Locked notes" disabled rows={2} defaultValue="Read only for now" />
          <Textarea label="Reason" rows={2} error="A reason is required" />
        </div>
      )
    }
  ]
};
