import { useState } from 'react';

import Button from '../../components/Button/Button';
import RichTextQuill from '../../components/RichTextQuill/RichTextQuill';

const RELEASE_NOTES = '<h2>Release notes</h2><p>Faster <strong>search</strong> and a <em>calmer</em> dashboard.</p>';

// Keeps the html in state and shows it under the editor
const Controlled = () => {
  const [value, setValue] = useState('<p>Edit <strong>this</strong> text.</p>');

  return (
    <div className="example-stack">
      <RichTextQuill value={value} onChange={setValue} />
      <p>HTML: <code>{value}</code></p>
      <div>
        <Button onClick={() => setValue(RELEASE_NOTES)}>Load release notes</Button>{' '}
        <Button onClick={() => setValue('')}>Clear</Button>
      </div>
    </div>
  );
};

export default {
  name: 'RichTextQuill',
  description: 'A Quill (snow theme) rich text editor with a fixed toolbar of fonts, sizes, alignment, bold, italic, lists, links, images and more. It takes the ReactQuill props: value and onChange for html, defaultValue, placeholder and readOnly.',
  examples: [
    {
      name: 'Placeholder',
      code: '<RichTextQuill placeholder="Write something..." />',
      output: <RichTextQuill placeholder="Write something..." />
    },
    {
      name: 'Controlled with state',
      code: `const [value, setValue] = useState('<p>Edit <strong>this</strong> text.</p>');

<RichTextQuill value={value} onChange={setValue} />
<p>HTML: <code>{value}</code></p>
<Button onClick={() => setValue(RELEASE_NOTES)}>Load release notes</Button>
<Button onClick={() => setValue('')}>Clear</Button>`,
      output: <Controlled />
    },
    {
      name: 'Starting content, uncontrolled',
      code: `<RichTextQuill defaultValue="<h2>Release notes</h2><p>Faster <strong>search</strong> and a <em>calmer</em> dashboard.</p>" />`,
      output: <RichTextQuill defaultValue={RELEASE_NOTES} />
    },
    {
      name: 'Read only',
      code: `<RichTextQuill readOnly value="<p>This text cannot be edited.</p>" />`,
      output: <RichTextQuill readOnly value="<p>This text cannot be edited.</p>" />
    }
  ]
};
