# FieldHint

Small help text under a form control ("Use your work email"), readable by a screen reader together with the control.

## When to use

- **Guidance that applies before the user makes a mistake:** a format, a limit, who will see the value. Corrections after a mistake are an `error`, shown with [`ErrorText`](../ErrorText/README.md).
- `Field`, `FieldRow` and `TextBox` draw one for you from their `hint` prop. Use `FieldHint` itself when you build the layout by hand, or place it inside a [`Field`](../Field/README.md) where you want it.

## Usage

```jsx
import { Field, FieldHint, FieldLabel, TextBox } from 'volta';

<Field>
  <FieldLabel>Email</FieldLabel>
  <TextBox type="email" />
  <FieldHint>Use your work email</FieldHint>
</Field>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `id` | `string` | | What the control's `aria-describedby` points at. Inside a `Field` or `FieldRow` it is set for you. |
| `children` | `node` | | The help text. |

It renders a `<p class="volta-field_hint">` in a smaller, muted style. It takes no `className` or other props.

## Accessibility

- Text is only announced with the control when the control's `aria-describedby` includes the hint's `id`. A `Field`, `FieldRow` or `TextBox` does this; by hand, give the hint an `id` and point the control at it.
- A hint is muted, so keep anything essential out of it; the label and the error carry required information.

## Do and don't

- Do keep it to one short sentence.
- Do put the format or limit here, not in the placeholder, which disappears when the user types.
- Don't use it for error messages; use the `error` prop so the control is marked invalid.
