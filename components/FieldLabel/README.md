# FieldLabel

The label above a form control: a styled `<label>` tied to its control, with an optional "(optional)" marker.

## When to use

- **A caption for a control you build yourself.** Give the control an `id` and point `htmlFor` at it. `TextField` and `Select` already draw a `FieldLabel` when you pass them `label` (and `optional`), so use it directly only for other controls.
- A label that wraps its control, with no ids needed, is [`Label`](../Label/README.md).
- A layout wrapper that spaces a labelled control is [`Field`](../Field/README.md); a ruled settings row with the label at the left is [`FieldRow`](../FieldRow/README.md).

## Usage

```jsx
import { FieldLabel, TextField } from 'volta';

<>
  <FieldLabel htmlFor="full_name" optional>Full name</FieldLabel>
  <TextField id="full_name" value={name} onChange={handleChange} />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `htmlFor` | `string` | | The `id` of the control this labels. Clicking the label focuses it. |
| `optional` | `bool` | | Adds an " (optional)" marker, in a lighter weight and colour, after the text. |
| `children` | `node` | | The label text, or text with a little markup such as `<strong>`. |

It renders a block `<label class="volta-field_label">` at 14px, weight 500, in `--v-color-trim-subtle`, with 4px of space under it. It takes no `className` or other props.

## Accessibility

- With `htmlFor` matching the control's `id`, the label is the control's accessible name and a click on it focuses the control. Without it the label is only text. Use `useId` to make ids that stay unique when a component appears more than once.
- The "(optional)" marker is real text, so it is read out; the fact is not carried by colour.

## Do and don't

- Do give every control a visible label; a placeholder is not a label.
- Do mark the exception: label optional fields "(optional)" and leave required ones plain.
- Do write short noun labels ("Full name"), not instructions.
- Don't use it without `htmlFor` for a form control; it would not name the control.
- Don't label a control twice (once with `FieldLabel` and again with a `label` prop on `TextField` or `Select`).
- Don't use it as a heading or a caption for a group of radios; it names one control.
