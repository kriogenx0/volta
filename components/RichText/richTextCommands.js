// What the rich text editor can do and how to ask for it: the paragraph styles and
// inline styles, their keyboard shortcuts, and the Markdown-style triggers typed at
// the start of a line. Data and pure functions, so they are easy to test; the
// component runs them (docs/features/rich_text.md).

// Block styles in the style select. `tag` is what the paragraph becomes.
export const PARAGRAPH_STYLES = [
  { value: 'p', label: 'Paragraph', tag: 'p', command: 'p', shortcut: { code: 'Digit0', alt: true } },
  { value: 'h1', label: 'Heading 1', tag: 'h1', command: 'h1', shortcut: { code: 'Digit1', alt: true } },
  { value: 'h2', label: 'Heading 2', tag: 'h2', command: 'h2', shortcut: { code: 'Digit2', alt: true } },
  { value: 'h3', label: 'Heading 3', tag: 'h3', command: 'h3', shortcut: { code: 'Digit3', alt: true } },
  { value: 'blockquote', label: 'Quote', tag: 'blockquote', command: 'quote', shortcut: { code: 'Digit9', shift: true } },
  { value: 'pre', label: 'Code block', tag: 'pre', command: 'codeBlock', shortcut: { key: 'c', alt: true } }
];

// Toolbar buttons and shortcuts. `mark` is the tags that show the style is on.
// Every shortcut needs the platform's command key (Cmd on a Mac, Ctrl elsewhere).
export const INLINE_STYLES = [
  { command: 'bold', label: 'Bold', text: 'B', mark: ['strong', 'b'], shortcut: { key: 'b' } },
  { command: 'italic', label: 'Italic', text: 'I', mark: ['em', 'i'], shortcut: { key: 'i' } },
  { command: 'underline', label: 'Underline', text: 'U', mark: ['u'], shortcut: { key: 'u' } },
  { command: 'strike', label: 'Strikethrough', text: 'S', mark: ['s', 'strike', 'del'], shortcut: { key: 'x', shift: true } },
  { command: 'code', label: 'Code', text: '</>', mark: ['code'], shortcut: { key: 'e' } },
  { command: 'link', label: 'Link', text: 'Link', mark: ['a'], shortcut: { key: 'k' } }
];

export const LIST_STYLES = [
  { command: 'bullets', label: 'Bulleted list', text: '• List', list: 'ul', shortcut: { code: 'Digit8', shift: true } },
  { command: 'numbers', label: 'Numbered list', text: '1. List', list: 'ol', shortcut: { code: 'Digit7', shift: true } }
];

export const CLEAR_STYLE = { command: 'clear', label: 'Clear formatting', text: 'Clear', shortcut: { key: '\\' } };

// Everything with a shortcut, in one list to match a key press against.
export const SHORTCUTS = [
  ...INLINE_STYLES,
  ...LIST_STYLES,
  ...PARAGRAPH_STYLES,
  CLEAR_STYLE
].filter((item) => item.shortcut).map((item) => ({ command: item.command, ...item.shortcut }));

// Typed at the start of an empty-so-far line, then a space, they turn the line
// into that style (as in Markdown). The value is a command from above.
const MARKDOWN = { '#': 'h1', '##': 'h2', '###': 'h3', '>': 'quote', '-': 'bullets', '*': 'bullets', '```': 'codeBlock' };

export const markdownCommand = (text) => {
  if (Object.prototype.hasOwnProperty.call(MARKDOWN, text)) return MARKDOWN[text];
  return /^\d+\.$/.test(text) ? 'numbers' : null;
};

// Which command a key press is, or null. The command key must be down, and no
// modifier the shortcut doesn't name may be (so Cmd+Shift+B isn't Bold).
export const matchShortcut = (event, mac) => {
  const mod = mac ? event.metaKey : event.ctrlKey;
  const other = mac ? event.ctrlKey : event.metaKey;
  if (!mod || other) return null;

  const found = SHORTCUTS.find((s) => (
    Boolean(s.shift) === event.shiftKey
    && Boolean(s.alt) === event.altKey
    && (s.code ? event.code === s.code : String(event.key).toLowerCase() === s.key)
  ));
  return found ? found.command : null;
};

// "⌘⇧X" on a Mac, "Ctrl+Shift+X" elsewhere.
export const shortcutLabel = (shortcut, mac) => {
  if (!shortcut) return '';
  const key = shortcut.code ? shortcut.code.replace('Digit', '') : shortcut.key.toUpperCase();
  if (!mac) return ['Ctrl', shortcut.alt && 'Alt', shortcut.shift && 'Shift', key].filter(Boolean).join('+');
  return `${shortcut.alt ? '⌥' : ''}${shortcut.shift ? '⇧' : ''}⌘${key}`;
};

const BLOCK_TAGS = ['p', 'h1', 'h2', 'h3', 'blockquote', 'pre'];

// What is at a point in the editor: its paragraph style, its list (if any) and the
// inline styles around it, read from the tags between `node` and `root`.
export const stylesAt = (node, root) => {
  const found = { block: null, list: null, marks: new Set() };
  for (let n = node; n && n !== root; n = n.parentNode) {
    if (n.nodeType !== 1) continue;
    const tag = n.nodeName.toLowerCase();
    if (!found.block && BLOCK_TAGS.includes(tag)) found.block = tag;
    if (!found.list && (tag === 'ul' || tag === 'ol')) found.list = tag;
    INLINE_STYLES.forEach((style) => { if (style.mark.includes(tag)) found.marks.add(style.command); });
  }
  return found;
};
