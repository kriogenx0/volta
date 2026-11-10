# TextBox

A text input, one line or with `multiline` a textarea, with an optional label, hint, size and error message. `TextField` and `Textarea` are other names for it.

## When to use

- **Any short typed answer:** a name, an email, a search term. Set `type` for `email`, `password`, `url` and the like.
- Add `multiline` for longer free text: a bio, a comment, a few lines to a few paragraphs. Use [`NumericField`](../NumericField/README.md) for numbers, [`DatePicker`](../DatePicker/README.md) for dates, [`NativeSelect`](../NativeSelect/README.md) or [`ComboBox`](../ComboBox/README.md) when the answer comes from a list, and [`TagInput`](../TagInput/README.md) for several keywords.
- Give it a `label`. To lay a label beside a control instead, wrap it in [`Field`](../Field/README.md).

## Usage

```jsx
import { TextBox } from 'volta';

<TextBox
  label="Email"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(event) => setEmail(event.target.value)}
  error={emailError}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | | Shows a `FieldLabel` above the field, linked to it with `htmlFor` (an id is generated if you give none). |
| `optional` | `bool` | `false` | With `label`, adds an "(optional)" marker. |
| `error` | `string` | | An error message shown under the field. It also marks the field invalid (red border, `aria-invalid`) and links the message with `aria-describedby`. |
| `validate` | `function` | | Called with the field's value on every key up, and used instead of any `onKeyUp` you pass. Set `error` from it. |
| `fieldSize` | `'sm'` \| `'md'` | `'sm'` | Padding and corner radius. Both fill the width of the parent. |
| `disabled` | `bool` | `false` | The native `disabled`; the cursor shows not-allowed over an input. |
| `hint` | `string` | | Help text under the field, read with it by a screen reader (`aria-describedby`). |
| `multiline` | `bool` | `false` | Renders a `<textarea>` instead of an `<input>`. |
| `resize` | `'both'` \| `'y'` \| `'none'` | `'both'` | With `multiline`: which way the user can drag the corner handle. `'y'` is vertical only, `'none'` turns the handle off. |
| `height` | `number` \| `string` | | With `multiline`: a fixed height, a number of pixels or any CSS length. Set as an inline style on the `<textarea>`. |
| `style` | `object` | | Inline style for the control. With `multiline`, `height` is merged into it. |
| `className` | `string` | | Added to the `<input>` or `<textarea>` itself. |
| `wrapperClassName` | `string` | | Added to the wrapper `div`. |
| `id` | `string` | | The control's id. With `label` and no `id`, one is generated. |
| `type` | `string` | `'text'` | The native input type. |

Every other prop goes to the control: `value`, `defaultValue`, `onChange`, `placeholder`, `name`, `autoComplete`, `maxLength`, `aria-*`, `data-*`. It works controlled (`value` and `onChange`) or uncontrolled (`defaultValue`).

## TextField

`TextField` is `TextBox` itself (`TextField === TextBox`), kept for existing code. New code uses `TextBox`.

## Textarea

`Textarea` is `<TextBox multiline />`: it takes the same props, so `label`, `hint`, `error`, `fieldSize`, `rows`, `resize` and `height` all work. Prefer `<TextBox multiline>` in new code.

The wrapper carries a `c-text_box` class, or `c-textarea` when `multiline`, kept for an older app's view styles; don't target them in new code.

## Accessibility

- It is a native `<input>` or `<textarea>`. With `label` the label is its accessible name and clicking it focuses the field; without `label`, pass `aria-label`.
- An `error` is shown as text under the field and set as `aria-invalid` and `aria-describedby`, so it is not conveyed by the red border alone.
- `optional` is text, not colour. Placeholders are not labels; don't use one as the only name.

## Do and don't

- Do label every field, and put the correction in the `error` text ("Enter an email like you@example.com").
- Do set `type`, `autoComplete` and `inputMode` so phones show the right keyboard.
- Don't use `placeholder` instead of a `label`.
- Don't signal an error with a border colour alone; set `error`.
- Don't set the colour or border with `className`; the look and the dark theme come from the theme tokens.
