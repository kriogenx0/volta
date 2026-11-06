# RichTextTinyMCE

A TinyMCE rich text editor, self-hosted, with a small toolbar and an HTML source button.

## When to use

- **Formatted text that people may also want to edit as HTML:** the toolbar has a `code` button that opens the source.
- Use [`RichTextQuill`](../RichTextQuill/README.md) for a lighter editor with a wider toolbar (fonts, colours, lists, media). Use [`Textarea`](../Textarea/README.md) for plain text.
- The toolbar is fixed: undo, redo, bold, italic, left, centre and right alignment, and code. The `link` and `image` plugins are loaded.

## Usage

```jsx
import { RichTextTinyMCE } from 'volta';

<RichTextTinyMCE value={html} onChange={setHtml} />;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | | The HTML to show. The editor is controlled by it. |
| `onChange` | `function` | | Called by TinyMCE (`onEditorChange`) with the new HTML as the user edits. |

No other prop is read. The toolbar, plugins and the GPL license key are fixed in the component.

## Accessibility

- TinyMCE renders its own toolbar and an editing area that Tab reaches; its built-in keyboard shortcuts apply.
- The wrapper passes no `aria-label` or visible label to the editor. Put a label next to it so its purpose is announced.
- The editor needs `tinymce/tinymce.min.js` served next to the app (the webpack config copies `node_modules/tinymce` to `compiled/tinymce/`). Until that script loads, nothing is shown.

## Do and don't

- Do keep the value in state and pass it back as `value`, so edits and the displayed content stay in step.
- Do sanitise HTML that came from another user before rendering it elsewhere; the value is markup.
- Don't add a TinyMCE API key or Tiny Cloud script; it is self-hosted under the GPL license.
- Don't expect to configure plugins or the toolbar through props; extend the component instead.
- Don't use it for short text; use [`TextField`](../TextField/README.md).
