# Field

A label, a control and optionally a hint and an error, laid out and connected so a screen reader reads them together.

## When to use

- **A labelled control in a form.** Wrap each `TextBox`, `Select`, `Toggle` or `Checkbox` in a `Field`. Leave out `label` for a control that carries its own text, like a `Checkbox`.
- A full-width ruled row for a settings page, with the label in a column at the left, is [`FieldRow`](../FieldRow/README.md). A row with helper text and error lines is `FormRow` (see [`BaseForm`](../Form/README.md)).
- Just the label, tied to a control by `htmlFor`, is [`FieldLabel`](../FieldLabel/README.md); just the help text is [`FieldHint`](../FieldHint/README.md). Both can go inside a `Field`.

## Usage

```jsx
import { Field, FieldHint, FieldLabel, FieldRow, TextBox, Toggle } from 'volta';

<>
  <Field label="Name" hint="As on your passport" error={nameError}>
    <TextBox name="name" />
  </Field>
  <Field>
    <FieldLabel optional>Nickname</FieldLabel>
    <TextBox name="nickname" />
    <FieldHint>Shown to other members</FieldHint>
  </Field>
  <Field label="Address">
    <FieldRow label="Street"><TextBox name="street" /></FieldRow>
    <FieldRow label="City"><TextBox name="city" /></FieldRow>
  </Field>
  <Field label="Email notifications" type="split">
    <Toggle name="emailNotifications" checked={enabled} onChange={handleChange} />
  </Field>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | | The caption, a `<label>` pointing at the control. Without it the children are rendered with no caption wrapper. |
| `hint` | `string` | | Help text under the control, read with it by a screen reader. |
| `error` | `string` | | An error message under the control. Marks the control invalid. |
| `htmlFor` | `string` | | The id of a control the `Field` doesn't make (a native `<input id="...">`). |
| `type` | `string` | | Adds a `field-<type>` class. Only `'split'` has styles: the label sits in a 140px column to the left of the control, and stacks above it at 640px and narrower. |
| `stack` | `string` \| `bool` | | Adds the `field-stack` class when truthy. The shipped stylesheet has no rule for it, so it changes nothing by itself. |
| `className` | `string` | | Added to the wrapper. |
| `children` | `node` | | The control, and optionally `FieldLabel`, `FieldHint` and `FieldRow`. |

### Inside a Field

`FieldLabel`, `FieldHint` and `FieldRow` can be direct children instead of (or as well as) the props:

- A **`FieldLabel`** is pointed at the one control (`htmlFor` and `id` are set for you). With several controls it names the group. If `label` is also given, the prop wins and the inner label keeps no id.
- A **`FieldHint`** is added to what describes the control, after the `hint` prop and before the `error`.
- A **`FieldRow`** is a container with controls of its own, so the `Field` becomes a group named by its label; each row keeps its own label.

Only direct children are wired up; a part nested deeper in other markup is left as it is.

The wrapper has 10px of space above and 20px below, and a 14px font size. It also carries a `c-field` class, kept for an older app's view styles; don't target it in new code.

## Accessibility

- With one control inside, the label's `for`, the control's `id`, `aria-describedby` (hint and error) and `aria-invalid` are connected for you. Clicking the label focuses the control and it is the control's accessible name.
- With several controls, or any `FieldRow`, the label names a `role="group"` instead and nothing is injected into the controls; give each its own name.
- `Field` adds no keyboard behaviour; the control keeps its own.

## Do and don't

- Do put one control in each `Field` and keep a consistent order: label, control, hint.
- Do use `type="split"` for on/off settings where the label and control sit side by side.
- Don't put a long form in one `Field`; one field per control keeps the spacing and the labels clear.
- Don't give both `Field` and the control the same visible label.
- Don't expect `stack` to change the layout; it has no styles yet.
