# RichText

A rich text editor with a toolbar, paragraph styles and keyboard shortcuts, built without an editing library.

## When to use

- **Formatted text people write themselves:** comments, descriptions, release notes, bios. It gives headings, quotes, code blocks, lists, bold, italic, underline, strikethrough, inline code and links, and reports the result as HTML.
- Use [`TextBox`](../TextBox/README.md) with `multiline` for plain text, and [`ContentEditable`](../ContentEditable/README.md) for a bare editable area with no toolbar.
- Use `editOnClick` for text that is mostly read and sometimes changed: it shows as text, and a click opens the editor.
- It replaces `RichTextQuill`, `RichTextTinyMCE` and `CKEditor`, which were removed. It has no images, tables, colours, fonts or HTML source view.

## Usage

```jsx
import { RichText } from 'volta';

<RichText
  aria-label="Description"
  placeholder="Write something..."
  value={html}
  onChange={setHtml}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | | The HTML to show. The editor is controlled by it. It is cleaned first, so only the tags below survive. |
| `defaultValue` | `string` | `''` | The HTML to start with when `value` is not given. |
| `onChange` | `function` | | Called with the new HTML as the user edits. It is always cleaned, and is `''` when there is no text. |
| `onBlur` | `function` | | Called with the HTML when focus leaves the whole editor (moving to the toolbar does not count). |
| `placeholder` | `string` | | Grey text shown while the editor is empty. With `editOnClick` it defaults to "Click to edit". |
| `disabled` | `bool` | `false` | Dims the editor and turns the toolbar off. |
| `readOnly` | `bool` | `false` | Shows the content with no toolbar and no editing. |
| `editOnClick` | `bool` | `false` | Shows the content as text. A click, or Enter or Space, opens the editor with the caret at the end; leaving it, or pressing Escape, closes it. |
| `height` | `number` \| `string` | | The editing area's minimum height: pixels, or any CSS length. It is 120px otherwise. |
| `className` | `string` | | Added to the outer element. |

Any other prop goes to the editing area: `aria-label`, `aria-labelledby`, `aria-describedby`, `id`, `data-*`.

## Styles and shortcuts

Use Cmd on a Mac and Ctrl elsewhere.

| Style | Shortcut | Typed at the start of a line |
| --- | --- | --- |
| Paragraph | Cmd+Alt+0 | |
| Heading 1, 2, 3 | Cmd+Alt+1, 2, 3 | `#`, `##`, `###` and a space |
| Quote | Cmd+Shift+9 | `>` and a space |
| Code block | Cmd+Alt+C | three backticks and a space |
| Bulleted list | Cmd+Shift+8 | `-` or `*` and a space |
| Numbered list | Cmd+Shift+7 | `1.` and a space |
| Bold, italic, underline | Cmd+B, I, U | |
| Strikethrough | Cmd+Shift+X | |
| Code | Cmd+E | |
| Link | Cmd+K | |
| Clear formatting | Cmd+\\ | |

Hover a toolbar button to see its shortcut. Undo and redo are the browser's (Cmd+Z, Cmd+Shift+Z), because formatting goes through the browser's editing commands.

## Safe HTML

Only these tags are kept: `p`, `h1`, `h2`, `h3`, `blockquote`, `pre`, `ul`, `ol`, `li`, `br`, `strong`, `em`, `u`, `s`, `code` and `a`. Browsers' `b`, `i`, `strike`, `del` and `div` become `strong`, `em`, `s` and `p`. Everything else is removed: scripts, styles and embeds with their content, other tags with their text kept, and every attribute except a link's `href`, which must be a web, email or phone address (or relative). Links get `rel="noopener noreferrer"`. Pasted and dropped content is cleaned the same way, and plain text becomes paragraphs. The cleaning is done by `sanitizeHtml` in `util/`.

## Accessibility

- The editing area is a `role="textbox"` with `aria-multiline`. Give it a name with `aria-label` or `aria-labelledby`; a visible label should point at it with `aria-labelledby`, since a `<label for>` cannot name a `contenteditable`.
- The toolbar is `role="toolbar"`. Each button has a name and a tooltip with its shortcut, and `aria-pressed` says whether the style is on at the caret; the on state also changes the fill, so colour is not the only cue. Tab moves through the buttons one at a time.
- The link box is a form: Enter applies, Escape cancels, and focus returns to the text. An address that is not allowed shows an error under the field.
- Pressing a toolbar button does not move focus out of the text. With `editOnClick`, the closed state is a button that Enter and Space press.
- Every shortcut works from the keyboard, and the toolbar buttons are touch targets of at least 32px (44px on touch screens).

## Do and don't

- Do keep the HTML in state and pass it back as `value`, so edits and the shown content stay in step.
- Do store and render the HTML you get from `onChange`; it is already cleaned. Clean HTML from anywhere else with `sanitizeHtml` before passing it in (the editor does it for you).
- Do name the editor with `aria-label` or `aria-labelledby`.
- Don't render HTML from another source with `dangerouslySetInnerHTML` unless you cleaned it.
- Don't expect formatting the editor cannot make (colours, fonts, images, tables) to survive a paste: it is removed.
- Don't rely on the toolbar showing bold or italic at an empty caret straight after pressing the shortcut; it updates once text is typed.
