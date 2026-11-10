# FieldRow

A full-width ruled row with a label in a column at the left and a control or content at the right.

## When to use

- **Settings and profile pages** where each row is one setting: a label on the left, its control on the right, rows stacked with a rule between them.
- A caption above a control in a normal form is [`Field`](../Field/README.md). A row with helper text and error lines is `FormRow` (see [`BaseForm`](../Form/README.md)). A bare label tied to a control is [`FieldLabel`](../FieldLabel/README.md).

## Usage

```jsx
import { FieldRow, TextField } from 'volta';

<>
  <FieldRow label="First name">
    <TextField placeholder="Enter first name" />
  </FieldRow>
  <FieldRow label="Accept terms" centered>
    <TextField placeholder="Type accept" />
  </FieldRow>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `node` | | The left column. Text, or markup. |
| `hint` | `string` | | Help text under the control, read with it by a screen reader. |
| `error` | `string` | | An error message under the control. Marks the control invalid. |
| `htmlFor` | `string` | | The id of a control the row doesn't make (a native `<input id="...">`). |
| `children` | `node` | | The right column. It grows to fill the rest of the row. A direct `FieldLabel` or `FieldHint` is connected to the control the way it is in [`Field`](../Field/README.md). |
| `centered` | `bool` | `false` | Centres the label and the body vertically. Without it they align to the top. |

`FieldRow` takes no `className` or other props.

## Variants and states

On desktop the label column is 25% of the row, between 150px and 280px wide, and the row has 20px of padding and a 1px rule above and below. Stacked rows share one rule. At 640px and narrower the row becomes a block: the label sits above the body and loses its width limits.

## Accessibility

- The label is a real `<label>`. With one control inside it is tied to it, so it names the control and clicking it focuses the control; the hint and error describe it and an error marks it invalid.
- With several controls the label names a `role="group"` instead; give each control its own name.
- The row adds no keyboard behaviour; the control inside keeps its own.

## Do and don't

- Do keep the label short and let it say which setting the row controls.
- Do stack rows directly under each other so the shared rule lines up.
- Don't use it for a single field in a form; use `Field`.
- Don't put several unrelated controls in one row; give each its own row.
- Don't expect to restyle it from outside: it takes no `className`, and its padding and rule are fixed in its stylesheet.
