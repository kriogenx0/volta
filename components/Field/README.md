# Field

A layout wrapper that puts a caption above (or beside) a form control and spaces it from the next one.

## When to use

- **A labelled control in a form.** Wrap each `TextField`, `Select`, `Textarea`, `Toggle` or `Checkbox` in a `Field`. Leave out `label` for a control that carries its own text, like a `Checkbox`.
- A full-width ruled row for a settings page, with the label in a column at the left, is [`FieldRow`](../FieldRow/README.md). A row with helper text and error lines is `FormRow` (see [`BaseForm`](../Form/README.md)).
- Just the label, tied to a control by `htmlFor`, is [`FieldLabel`](../FieldLabel/README.md).
- `Field` has no slot for a hint or an error. Show an error with [`ErrorText`](../ErrorText/README.md) or the `error` prop of `TextField`.

## Usage

```jsx
import { Field, TextField, Toggle } from 'volta';

<>
  <Field label="Name">
    <TextField name="name" />
  </Field>
  <Field label="Email notifications" type="split">
    <Toggle name="emailNotifications" checked={enabled} onChange={handleChange} />
  </Field>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | | The caption. Without it the children are rendered with no caption wrapper. |
| `type` | `string` | | Adds a `field-<type>` class. Only `'split'` has styles: the label sits in a 140px column to the left of the control, and stacks above it at 640px and narrower. |
| `stack` | `string` \| `bool` | | Adds the `field-stack` class when truthy. The shipped stylesheet has no rule for it, so it changes nothing by itself. |
| `className` | `string` | | Added to the wrapper. |
| `children` | `node` | | The control. |

The wrapper has 10px of space above and 20px below, and a 14px font size. It also carries a `c-field` class, kept for an older app's view styles; don't target it in new code.

## Accessibility

- The caption is a `div`, not a `<label>`, so it is not tied to the control and clicking it does not focus the control. A screen reader will not announce it as the control's name.
- Give the control its own name: use the `label` prop of `TextField` or `Select` (they draw a `FieldLabel` tied to the control), or put `aria-label` on the control. Don't give both `Field` and the control the same visible label.
- `Field` adds no roles and no keyboard behaviour; the control keeps its own.

## Do and don't

- Do put one control in each `Field` and keep a consistent order: label, control.
- Do use `type="split"` for on/off settings where the label and control sit side by side.
- Don't put a long form in one `Field`; one field per control keeps the spacing and the labels clear.
- Don't rely on the caption alone to name a control for assistive technology; see Accessibility.
- Don't expect `stack` to change the layout; it has no styles yet.
