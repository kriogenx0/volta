import { useState } from 'react';

import Button from '../../components/Button/Button';
import RichTextTinyMCE from '../../components/RichTextTinyMCE/RichTextTinyMCE';

const AGENDA = '<h2>Agenda</h2><ul><li>Review the <strong>roadmap</strong></li><li>Plan the <em>next</em> release</li></ul>';

// Keeps the html in state; with `showHtml` the html is printed under the editor
const Controlled = ({ initial = '', showHtml = false }) => {
  const [value, setValue] = useState(initial);

  return (
    <div className="example-stack">
      <RichTextTinyMCE value={value} onChange={setValue} />
      {showHtml && <p>HTML: <code>{value || '(empty)'}</code></p>}
      {showHtml && (
        <div>
          <Button onClick={() => setValue(AGENDA)}>Load agenda</Button>{' '}
          <Button onClick={() => setValue('')}>Clear</Button>
        </div>
      )}
    </div>
  );
};

export default {
  name: 'RichTextTinyMCE',
  description: 'A TinyMCE rich text editor with undo and redo, bold, italic, alignment and an HTML source button, plus the link and image plugins. It takes value (html) and onChange(html). TinyMCE is self-hosted and loads from tinymce/tinymce.min.js, so the editor appears once that script has loaded.',
  examples: [
    {
      name: 'Empty editor',
      code: '<RichTextTinyMCE />',
      output: <RichTextTinyMCE />
    },
    {
      name: 'Controlled with state',
      code: `const [value, setValue] = useState('');

<RichTextTinyMCE value={value} onChange={setValue} />
<p>HTML: <code>{value || '(empty)'}</code></p>
<Button onClick={() => setValue(AGENDA)}>Load agenda</Button>
<Button onClick={() => setValue('')}>Clear</Button>`,
      output: <Controlled showHtml />
    },
    {
      name: 'Starting with formatted content',
      code: `const [value, setValue] = useState(AGENDA);

<RichTextTinyMCE value={value} onChange={setValue} />`,
      output: <Controlled initial={AGENDA} />
    }
  ]
};
