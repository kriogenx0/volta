import { useState } from 'react';

import Button from '../../components/Button/Button';
import ContentEditable from '../../components/ContentEditable/ContentEditable';

const SIGNATURE = '<b>Alex</b><br>Volta design team';

// Shows the html the component reports, so typing and formatting shortcuts
// (Ctrl or Cmd + B and I) can be seen in the output.
const Live = ({ initial, children }) => {
  const [html, setHtml] = useState(initial);

  return (
    <div className="example-stack">
      <ContentEditable aria-label="Message" html={html} onChange={(e) => setHtml(e.target.value)} />
      <p>HTML: <code>{html || '(empty)'}</code></p>
      {children && children(setHtml)}
    </div>
  );
};

export default {
  name: 'ContentEditable',
  description: 'A bordered div the user can type in. It starts from the html prop and calls onChange({ target: { value } }) with the new innerHTML as they type, so it works like a rich text field. Changing html from outside replaces the content.',
  examples: [
    {
      name: 'Editable text',
      code: '<ContentEditable aria-label="Note" html="Click here and start typing." onChange={handleChange} />',
      output: <ContentEditable aria-label="Note" html="Click here and start typing." onChange={() => {}} />
    },
    {
      name: 'Shows the html it reports',
      code: `const [html, setHtml] = useState('Hello <i>world</i>');

<ContentEditable aria-label="Message" html={html} onChange={(e) => setHtml(e.target.value)} />
<p>HTML: <code>{html}</code></p>`,
      output: <Live initial="Hello <i>world</i>" />
    },
    {
      name: 'Replaced from outside',
      code: `<ContentEditable aria-label="Message" html={html} onChange={(e) => setHtml(e.target.value)} />
<Button onClick={() => setHtml(SIGNATURE)}>Insert signature</Button>
<Button onClick={() => setHtml('')}>Clear</Button>`,
      output: (
        <Live initial="Draft message">
          {(setHtml) => (
            <div>
              <Button onClick={() => setHtml(SIGNATURE)}>Insert signature</Button>{' '}
              <Button onClick={() => setHtml('')}>Clear</Button>
            </div>
          )}
        </Live>
      )
    },
    {
      name: 'Empty',
      code: '<ContentEditable aria-label="Empty field" onChange={handleChange} />',
      output: <ContentEditable aria-label="Empty field" onChange={() => {}} />
    }
  ]
};
