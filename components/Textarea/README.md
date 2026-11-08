# Textarea

A multi-line text input built on `TextField`, with a choice of how the corner handle resizes it.

## When to use

- **Longer free text:** a bio, a comment, a description of a few lines to a few paragraphs.
- Use [`TextField`](../TextField/README.md) for a single line, [`RichTextQuill`](../RichTextQuill/README.md) or [`RichTextTinyMCE`](../RichTextTinyMCE/README.md) when the text needs formatting, and [`TextEditable`](../TextEditable/README.md) to edit a short piece of text in place.
- It is a `TextField` with `multiline`, so it takes the same `label`, `optional`, `error`, `fieldSize`, `validate` and `disabled` props.

## Usage

```jsx
import { Textarea } from 'volta';

<Textarea
  label="Bio"
  optional
  rows={4}
  resize="y"
  value={bio}
  onChange={(event) => setBio(event.target.value)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `resize` | `'both'` \| `'y'` \| `'none'` | `'both'` | Which way the user can drag the corner handle. `'y'` is vertical only, `'none'` turns the handle off. |
| `height` | `number` \| `string` | | A fixed height: a number is pixels, a string any CSS length. Set as an inline style on the `<textarea>`. |
| `style` | `object` | | Inline style for the `<textarea>`. `height` is merged into it. |
| `className` | `string` | | Added to the `<textarea>` itself, after the resize class. |

Every other prop goes to [`TextField`](../TextField/README.md) and from there to the `<textarea>`: `label`, `optional`, `error`, `fieldSize`, `rows`, `placeholder`, `value`, `defaultValue`, `onChange`, `maxLength`, `aria-*`. The wrapper also gets a `c-textarea` class for older pages that style it. The width always fills the parent.

## Accessibility

- It is a native `<textarea>`: Tab reaches it, and screen readers and spell check work as usual.
- With `label` the label is its accessible name; without one, pass `aria-label`. Don't use `placeholder` as the only name.
- An `error` is shown as text and set as `aria-invalid` and `aria-describedby`.
- Dragging the resize handle is pointer-only; set `rows` or `height` sensibly so keyboard users get a usable size.

## Do and don't

- Do set `rows` (or `height`) to the amount of text you expect, and tell people the limit in text if you set `maxLength`.
- Do use `resize="y"` or `"none"` in tight layouts, so a drag can't break the page width.
- Don't use it for a single line of text; use [`TextField`](../TextField/README.md).
- Don't pass any other `resize` value; anything but `both`, `y` or `none` leaves the handle off.
- Don't signal an error by colour alone; set `error`.
