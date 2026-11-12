# Radio

A single styled radio button with its label, for one option in a set where only one can be chosen.

## When to use

- **One option you lay out yourself**, such as radios with extra content beside them. Give the radios of one set the same `name`.
- Use [`RadioGroup`](../RadioGroup/README.md) for a set built from an options array with a controlled `value`, which is the usual case. Use [`SegmentedControl`](../SegmentedControl/README.md) for two to five short choices that read as a toggle bar, and [`NativeSelect`](../NativeSelect/README.md) for many choices.
- For an on or off choice use [`Toggle`](../Toggle/README.md) (applies immediately) or [`Checkbox`](../Checkbox/README.md) (submitted with a form). A lone radio cannot be turned off again.

## Usage

```jsx
import { Radio } from 'volta';

<>
  <Radio name="plan" title="Free" value="free" defaultChecked />
  <Radio name="plan" title="Pro" value="pro" />
  <Radio name="plan" title="Enterprise" value="enterprise" disabled />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string` | | The label text beside the radio. It is also set as the label's `title` (a tooltip). |
| `disabled` | `bool` | | Native `disabled`: not focusable, dimmed, no hover. |

Every other prop goes to the native `<input type="radio">`: `name`, `value`, `checked` or `defaultChecked`, `onChange`, `id`, `aria-*`, `className` (the input's, not the label's). It is controlled when you give `checked` and `onChange`, and uncontrolled with `defaultChecked`. The whole `<label>` is the click target.

## Look

The whole label is the target, so it has padding all round (8px above and below, 12px at the sides), and while the pointer is over it a subtle fill (the `base-more-subtle` token) shows how far it reaches, the text goes to full strength and the radio button's border takes the accent. The padding is always there, so nothing moves or resizes on hover. A disabled one shows none of this.

## Accessibility

- It is a native radio inside a `<label>`, so the label text is its accessible name and clicking the text selects it.
- Radios with the same `name` form one group: Tab moves into the group, the arrow keys move and choose within it, and only the chosen radio is in the tab order.
- The checked state is shown by a filled dot as well as the colour. A visible focus ring appears from the keyboard.
- Name the group, not just each radio: wrap the set in a `<fieldset>` with a `<legend>` (or `role="radiogroup"` with a label).

## Do and don't

- Do give each radio in a set the same `name` and its own `value`.
- Do start with one option chosen when a choice is required, so the group is never empty by accident.
- Don't use radios for a yes or no setting; use a `Toggle` or `Checkbox`.
- Don't use one radio on its own, or more than about five in a row; use a `NativeSelect`.
- Don't hide the label; `title` is the text users read and screen readers announce.
