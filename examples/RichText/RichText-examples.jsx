import { useState } from 'react';

import Button from '../../components/Button/Button';
import Code from '../../components/Code/Code';
import RichText from '../../components/RichText/RichText';
import {
  CLEAR_STYLE, INLINE_STYLES, LIST_STYLES, PARAGRAPH_STYLES, shortcutLabel
} from '../../components/RichText/richTextCommands';

const NOTES = '<h2>Release notes</h2><p>Faster <strong>search</strong> and a <em>calmer</em> dashboard.</p><ul><li>Bulk edit</li><li>Saved views</li></ul>';

// Keeps the html in state and shows it under the editor
const Controlled = () => {
  const [value, setValue] = useState('<p>Edit <strong>this</strong> text.</p>');

  return (
    <div className="example-stack">
      <RichText aria-label="Notes" value={value} onChange={setValue} />
      <p>HTML: <code>{value || '(empty)'}</code></p>
      <div className="example-row">
        <Button onClick={() => setValue(NOTES)}>Load release notes</Button>
        <Button onClick={() => setValue('')}>Clear</Button>
      </div>
    </div>
  );
};

const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || '');

const SHORTCUTS = [
  ...INLINE_STYLES.map((item) => [item.label, item.shortcut]),
  ...PARAGRAPH_STYLES.map((item) => [item.label, item.shortcut]),
  ...LIST_STYLES.map((item) => [item.label, item.shortcut]),
  [CLEAR_STYLE.label, CLEAR_STYLE.shortcut]
];

// Every shortcut, written the way this computer writes it
const Shortcuts = () => (
  <ul className="example-stack">
    {SHORTCUTS.map(([label, shortcut]) => (
      <li key={label}><Code inline>{shortcutLabel(shortcut, mac)}</Code> {label}</li>
    ))}
  </ul>
);

const ClickToEdit = () => {
  const [value, setValue] = useState('<p>Click this text to edit it.</p>');
  return <RichText aria-label="Summary" editOnClick value={value} onChange={setValue} />;
};

export default {
  name: 'RichText',
  description: 'A rich text editor with no editing library. A toolbar and keyboard shortcuts set paragraph styles (paragraph, three heading levels, quote, code block, bulleted and numbered lists) and inline styles (bold, italic, underline, strikethrough, code, link), and typing "# " or "- " at the start of a line does the same, as in Markdown. value and onChange carry cleaned HTML; pasted and dropped content is cleaned too.',
  examples: [
    {
      name: 'Placeholder',
      code: '<RichText aria-label="Comment" placeholder="Write something..." />',
      output: <RichText aria-label="Comment" placeholder="Write something..." />
    },
    {
      name: 'Controlled with state',
      code: `const [value, setValue] = useState('<p>Edit <strong>this</strong> text.</p>');

<RichText aria-label="Notes" value={value} onChange={setValue} />
<p>HTML: <code>{value || '(empty)'}</code></p>
<Button onClick={() => setValue(RELEASE_NOTES)}>Load release notes</Button>
<Button onClick={() => setValue('')}>Clear</Button>`,
      output: <Controlled />
    },
    {
      name: 'Keyboard shortcuts',
      code: `<RichText aria-label="Draft" defaultValue="<p>Try Cmd or Ctrl+B on this.</p>" />
// Cmd on a Mac, Ctrl elsewhere. Typing "# ", "## ", "### ", "> ", "- ", "1. "
// or "\`\`\` " at the start of a line sets that style.`,
      output: (
        <div className="example-stack">
          <RichText aria-label="Draft" defaultValue="<p>Try Cmd or Ctrl+B on this.</p>" />
          <Shortcuts />
        </div>
      )
    },
    {
      name: 'Click to edit',
      code: `<RichText aria-label="Summary" editOnClick value={value} onChange={setValue} />`,
      output: <ClickToEdit />
    },
    {
      name: 'Minimum height',
      code: '<RichText aria-label="Essay" height={240} placeholder="At least 240px tall" />',
      output: <RichText aria-label="Essay" height={240} placeholder="At least 240px tall" />
    },
    {
      name: 'Read only and disabled',
      code: `<RichText aria-label="Published" readOnly defaultValue={NOTES} />
<RichText aria-label="Locked" disabled defaultValue={NOTES} />`,
      output: (
        <div className="example-stack">
          <RichText aria-label="Published" readOnly defaultValue={NOTES} />
          <RichText aria-label="Locked" disabled defaultValue={NOTES} />
        </div>
      )
    }
  ]
};
