# ContentEditable

A multi-line box the user types straight into, as an editable `<div>` that reports its HTML.

## When to use

- **A small area of lightly formatted text** where the browser's own editing (line breaks, paste, undo) is enough and the value is HTML.
- Formatting toolbars are [`RichTextQuill`](../RichTextQuill/README.md) or [`RichTextTinyMCE`](../RichTextTinyMCE/README.md). Plain text in a form is a [`Textarea`](../TextBox/README.md). A single line that is edited in place is a [`TextEditable`](../TextEditable/README.md).
- It has no toolbar, so formatting is only what the browser's own shortcuts give, and pasted text keeps its markup.

## Usage

```jsx
import { ContentEditable } from 'volta';

<ContentEditable
  html={body}
  onChange={(e) => setBody(e.target.value)}
  aria-label="Message"
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `html` | `string` | `''` | The content, as HTML. It is written once at the start; later changes from outside replace the content when they differ from what the box last reported. |
| `onChange` | `function` | | Called with `{ target: { value } }`, where `value` is the box's `innerHTML`. Fires on input and on blur, only when the HTML has changed. |
| `className` | `string` | | Added after `volta-content_editable`. |

Any other prop goes to the editable `<div>`: `aria-label`, `aria-labelledby`, `id`, `data-*`, `role`. The `onChange` argument is a plain object shaped like an event, not a React event.

## Behaviour

- The box keeps the caret where it is while the user types; `html` is not rewritten on every keystroke. To clear it or load new content, pass a different `html`.
- It is at least 64px tall and grows with its content.
- Hover tints the border and background, and focus shows a 2px accent ring.

## Accessibility

- The box is `role="textbox"` with `aria-multiline="true"`. Both can be overridden through the other props.
- A textbox needs a name: pass `aria-label`, or `aria-labelledby` pointing at a visible label. Without one a screen reader announces an unnamed text box.
- It is a focusable editable region, reached by Tab like any text field.

## Do and don't

- Do clean the HTML before you store it or show it elsewhere. The value is whatever the user typed or pasted, including pasted markup.
- Do pass only HTML you trust as the starting `html`; it is set with `dangerouslySetInnerHTML`.
- Don't use it for a password, number or any value that needs validation as the user types; use a `TextField`.
- Don't use it as a natively posted form field; it has no input behind it and posts nothing.
- Don't use it for a single line; use a `TextField` or `TextEditable`.
