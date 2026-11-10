# Rich text

`RichText` is the rich text editor: a toolbar over a `contentEditable` area, with paragraph styles, inline styles, keyboard shortcuts and Markdown-style typing, and no editing library. It replaced `RichTextQuill`, `RichTextTinyMCE` and `CKEditor`, which were removed together with the `react-quill-new`, `tinymce` and `@tinymce/tinymce-react` packages. Guideline: `components/RichText/README.md`; examples under Rich Text in the styleguide.

## What it does

- **Paragraph styles** from a select, a shortcut or typing: Paragraph, Heading 1 to 3, Quote, Code block, bulleted and numbered lists (`#`, `##`, `###`, `>`, three backticks, `-`, `*`, `1.` and a space at the start of a line).
- **Inline styles** from buttons and shortcuts: bold, italic, underline, strikethrough, code, link, and clear formatting. Shortcuts use Cmd on a Mac and Ctrl elsewhere (`richTextCommands.js` lists them; the toolbar tooltips show them).
- **Link box:** an inline form (no native dialog) that adds https:// or mailto: to a bare address and refuses anything that is not a web, email or phone address.
- **`editOnClick`:** shows the content as text (a button that Enter and Space press); a click opens the editor with the caret at the end, and focus leaving or Escape closes it. This is what `CKEditor`'s click-to-edit field was.
- **`readOnly`**, **`disabled`**, **`placeholder`**, **`height`** (minimum), **`onChange`** and **`onBlur`** with the HTML.
- **Always safe HTML.** `value`, pasted and dropped content, and everything reported to `onChange` go through `sanitizeHtml` (`util/sanitizeHtml.js`): an allow-list of tags, no attributes except a safe link `href`, scripts and embeds dropped. Browsers' `b`, `i`, `strike` and `div` become `strong`, `em`, `s` and `p`.

## How it works

Formatting calls `document.execCommand` (`bold`, `formatBlock`, `insertUnorderedList`, `createLink`, ...), so the browser's undo and redo cover it. The caret's styles are read from the tags around it (`stylesAt`), and the toolbar's `aria-pressed` and the style select follow it. A toolbar press keeps the text selected (`mousedown` is not allowed to move focus), and the link box restores the saved selection. The html is only given to React once; later changes from outside are written by an effect, so the caret doesn't jump as the user types.

## Where it lives

- `components/RichText/RichText.jsx`, `RichText.scss`, `README.md`.
- `components/RichText/richTextCommands.js`: the styles, shortcuts and Markdown triggers as data, with the pure functions `matchShortcut`, `shortcutLabel`, `markdownCommand` and `stylesAt`.
- `util/sanitizeHtml.js`: `sanitizeHtml` and `safeHref`.

## Tests

- `tests/RichText/RichText.test.jsx`: the editor with `document.execCommand` recorded: rendering, value and `defaultValue`, cleaned `onChange`, read only and disabled, toolbar and select commands, `aria-pressed` at the caret, shortcuts, Markdown typing, paste and drop, the link box, inline code, click to edit, `onBlur`.
- `tests/RichText/richTextCommands.test.js`: shortcut matching and labels, Markdown triggers, `stylesAt`.
- `tests/sanitizeHtml/sanitizeHtml.test.js`: what is kept, converted and removed, including disguised `javascript:` links.

## Known limits

- **Not verified in a real browser.** jsdom has no editing commands, so the tests prove which commands are asked for, not what Chrome, Safari or Firefox do with them. How `formatBlock` handles quotes, lists and code blocks, the caret after a Markdown conversion, and the look of the toolbar and content at desktop and mobile widths are unchecked.
- `document.execCommand` is deprecated in the specification, though every browser supports it and there is no replacement for rich editing in a `contentEditable`.
- No images, tables, colours, fonts, alignment, indentation or HTML source view; pasted content with them keeps only the text and the supported tags.
- The toolbar does not show bold or italic at an empty caret straight after the shortcut; it updates once text is typed (the caret's styles are read from the tags, not from the browser's pending state).
- Toolbar buttons are all Tab stops; they do not use arrow-key navigation.
- Nothing is saved: the editor reports HTML, and the app stores it.

## History

- 2026-11-10 (local, not merged or deployed): added `RichText`; removed `RichTextQuill`, `RichTextTinyMCE` and `CKEditor`, the TinyMCE copy step in the Vite configs, `vite-plugin-static-copy`, and the three npm packages.
