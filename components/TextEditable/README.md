# TextEditable

Text you click to edit in place, as a `contentEditable` element that looks like plain text until hovered or focused.

## When to use

- **Renaming or retitling something inline:** a page title, a list item's name, a card heading. Enter saves and Escape cancels.
- Use [`TextField`](../TextField/README.md) or [`Textarea`](../Textarea/README.md) for a field in a form, [`ContentEditable`](../ContentEditable/README.md) for a `contentEditable` area you drive with `html` and `onChange`, and [`RichTextQuill`](../RichTextQuill/README.md) for formatted text.
- It is single-line by design: Enter leaves the field rather than adding a line break.

## Usage

```jsx
import { TextEditable } from 'volta';

<TextEditable
  tagName="h3"
  value={title}
  aria-label="Title"
  onChange={setTitle}
  onFinish={saveTitle}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | | The starting content, as HTML. `children` is used when `value` is not given. |
| `children` | `node` | | The starting content, as an alternative to `value`. |
| `tagName` | `string` | `'div'` | The element to render, such as `'h3'` or `'span'`. |
| `disabled` | `bool` | `false` | Turns editing off (`contentEditable` false). |
| `className` | `string` | `''` | Added after `volta-text_editable`. |
| `onChange` | `function` | | Called with `(html, event)` as the user types, when the HTML has changed. |
| `onBlur` | `function` | | Called with `(html, event)` when the element loses focus. |
| `onFinish` | `function` | | Called with `(html, event)` after a blur, once `onChange` has had its say. This is the place to save. |

Any other prop (`aria-label`, `role`, `data-*`, `id`) goes to the element. The content is read back as `innerHTML`, so the value is HTML: `&` comes back as `&amp;`. It starts from `value` only: after mount, later changes to `value` don't replace what is shown (remount it with a `key` to reset).

## Accessibility

- A `contentEditable` element can take focus from the keyboard, but it has no role or name of its own. Pass `aria-label` (and `role="textbox"` if you want it announced as an editable field).
- Enter ends editing and Escape restores the text from before the edit; tell keyboard and screen-reader users, for instance in a hint or tooltip.
- Focus shows a 2px outline; hover only changes the background and the cursor, so keyboard users don't depend on hover.

## Do and don't

- Do save in `onFinish`, and treat the value as HTML: escape text that came from users before passing it as `value` or `children`, since it is set as markup.
- Do give it a label, and make the surrounding text say it can be edited.
- Don't use it for anything submitted with a form; use [`TextField`](../TextField/README.md).
- Don't expect plain text: strip or escape HTML on the way in and out.
- Don't use it for long text; use [`Textarea`](../Textarea/README.md).
