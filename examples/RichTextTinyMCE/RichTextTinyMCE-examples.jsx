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
  description: 'A TinyMCE rich text editor with undo and redo, bold, italic, alignment and an HTML source button, plus the link and image plugins. It takes value (html) and onChange(html); disabled and readonly turn editing off, placeholder shows grey text while it is empty, and height sets its size. TinyMCE is self-hosted and loads from tinymce/tinymce.min.js (change it with tinymceScriptSrc), so the editor appears once that script has loaded. init passes any other TinyMCE option, such as skin: \'oxide-dark\' with content_css: \'dark\' for a dark page.',
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
    },
    {
      name: 'With a placeholder',
      code: '<RichTextTinyMCE placeholder="Write the meeting notes here" />',
      output: <RichTextTinyMCE placeholder="Write the meeting notes here" />
    },
    {
      name: 'Fixed height',
      code: '<RichTextTinyMCE height={200} />',
      output: <RichTextTinyMCE height={200} />
    },
    {
      name: 'Read only',
      code: '<RichTextTinyMCE readonly value={AGENDA} />',
      output: <RichTextTinyMCE readonly value={AGENDA} />
    },
    {
      name: 'Disabled',
      code: '<RichTextTinyMCE disabled value={AGENDA} />',
      output: <RichTextTinyMCE disabled value={AGENDA} />
    },
    {
      name: 'Dark skin (any other TinyMCE option goes in init)',
      code: `<RichTextTinyMCE init={{ skin: 'oxide-dark', content_css: 'dark' }} />`,
      output: <RichTextTinyMCE init={{ skin: 'oxide-dark', content_css: 'dark' }} />
    }
  ]
};
