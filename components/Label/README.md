# Label

A native `<label>` that wraps a control and its caption together, so clicking the caption focuses the control.

## When to use

- **A caption for a control that sits inside it**, with no ids to manage: `<Label text="Email"><input /></Label>`. The control takes its name from the caption.
- A styled label above `TextField`, `Select` or another control, tied by `htmlFor`, is [`FieldLabel`](../FieldLabel/README.md); `TextField` and `Select` draw one themselves when given `label`. Spacing around a labelled control is [`Field`](../Field/README.md).
- A heading or a plain piece of text is not a label; use text or [`PageHeading`](../PageHeading/README.md).

## Usage

```jsx
import { Label, TextField } from 'volta';

<>
  <Label text="Email address">
    <TextField type="email" name="email" />
  </Label>
  <Label>
    <input type="checkbox" name="agree" /> I agree to the terms
  </Label>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | `string` | | The caption. With `children` too, it is shown above the control. Alone, it is the label's only content. |
| `children` | `node` | | The control, or the whole label content when there is no `text`. |

With both `text` and `children`, the caption and the control each get their own `div` inside one `<label>`. With only one of them, that one is rendered alone inside the `<label>`, inside a `div.volta-label`.

## Accessibility

- Because the control is inside the `<label>`, a click on the caption focuses or toggles it, and assistive technology uses the caption as its name. No `id` or `htmlFor` is needed.
- With only `text` and no control, the `<label>` is just text tied to nothing. Don't use that form for a field.
- It adds no visible styling of its own, so the caption looks like surrounding text. Use `FieldLabel` where the caption should look like a form label.

## Do and don't

- Do put exactly one control inside each `Label`.
- Do keep the caption short and say what the control is for.
- Don't use it for a group of controls; a group wants a `fieldset` and a legend.
- Don't nest a second `<label>` inside it, for example by wrapping a component that draws its own `FieldLabel`.
- Don't use it as a page or section heading.
