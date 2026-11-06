# RichTextQuill

A Quill (snow theme) rich text editor with a fixed toolbar, for editing formatted text as HTML.

## When to use

- **Longer formatted text:** descriptions, notes, release notes, anything that needs bold, lists, links or images.
- Use [`RichTextTinyMCE`](../RichTextTinyMCE/README.md) when you want TinyMCE's HTML source button and plugins instead. Use [`Textarea`](../Textarea/README.md) for plain text, and [`TextEditable`](../TextEditable/README.md) to edit a short label in place.
- The toolbar is fixed (fonts, sizes, alignment, bold, italic, underline, strike, colours, sub and superscript, quote, code block, lists, indent, link, image, video, clear). You can't change it per use.

## Usage

```jsx
import { RichTextQuill } from 'volta';

<RichTextQuill
  value={html}
  onChange={setHtml}
  placeholder="Write something..."
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | | The HTML to show. With `onChange`, the editor is controlled. |
| `defaultValue` | `string` | | Starting HTML for an uncontrolled editor. |
| `onChange` | `function` | | Called with `(html, delta, source, editor)` on every edit (the ReactQuill signature). |
| `placeholder` | `string` | | Shown while the editor is empty. |
| `readOnly` | `bool` | `false` | Shows the content without letting the user edit it. |
| `className` | `string` | | Added after `volta-rich_text_quill` on the editor's container. |

Every other prop is passed to ReactQuill (from `react-quill-new`). `modules` is the exception: the toolbar is `RichTextQuill.modules` and can't be replaced through props. The editing area is at least 150px tall.

## Accessibility

- The editing area is a `contenteditable` element, so it is reachable by Tab and Quill's own keyboard shortcuts (such as Ctrl or Cmd with B, I and U) work.
- The editor has no visible label of its own. Put a label next to it, or give the surrounding region one, so its purpose is announced.
- Don't rely on the toolbar alone for essential formatting; check the result by keyboard.

## Do and don't

- Do store and display the value as HTML from a source you trust. The value is markup, so sanitise anything that came from another user before rendering it elsewhere.
- Do use `readOnly` to preview content rather than hiding the toolbar with CSS.
- Don't use it for short single-line text; use [`TextField`](../TextField/README.md).
- Don't add toolbar buttons by overriding `modules`; it is fixed.
- Don't recolour the editor with literals in `className`; the container takes its background from the `--v-color-base` token.
