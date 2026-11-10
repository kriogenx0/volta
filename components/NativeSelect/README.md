# NativeSelect

A styled native `<select>` for choosing one value from a list, with an optional label above it. `Select` is another name for it.

## When to use

- **One choice from a list too long for buttons,** submitted with a form or applied on change.
- Use [`SegmentedControl`](../SegmentedControl/README.md) or [`RadioGroup`](../RadioGroup/README.md) for 2 to 5 options that should all stay visible, [`MultiSelect`](../MultiSelect/README.md) to pick several, and [`ComboBox`](../ComboBox/README.md) or [`AutoComplete`](../AutoComplete/README.md) when the user should be able to type to filter.
- Give it `options`, or your own `<option>` and `<optgroup>` children for groups and a disabled placeholder.

## Usage

```jsx
import { NativeSelect } from 'volta';

<NativeSelect
  label="City"
  name="city"
  options={[
    { label: 'San Francisco', value: 'sf' },
    { label: 'New York', value: 'ny' },
    { label: 'London', value: 'lon' }
  ]}
  value={city}
  onChange={(event) => setCity(event.target.value)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `options` | `array` of `{ label, value }` | `[]` | The choices. Ignored when `children` is given. |
| `children` | `node` | | Your own `<option>` and `<optgroup>` elements, used instead of `options`. |
| `value` | `any` | | The selected value. Leave it out for an uncontrolled select. |
| `onChange` | `function` | | The native change event: read `event.target.value`. |
| `name` | `any` | | The native `name`, for forms. |
| `label` | `string` | | Shows a `FieldLabel` above the select and links it with `htmlFor`. |
| `optional` | `bool` | `false` | With `label`, adds an "(optional)" marker. |
| `fieldSize` | `'sm'` \| `'md'` | `'sm'` | Padding and font size. Both fill the width of the parent. |
| `className` | `string` | | Added to the `<select>` itself, not the wrapper. |
| `id` | `string` | | The select's id. With `label` one is generated if you leave it out. |

Any other prop goes to the `<select>`: `disabled`, `required`, `autoFocus`, `aria-label`, `data-*`.

## Select

`Select` is `NativeSelect` itself (`Select === NativeSelect`), kept for existing code. New code uses `NativeSelect`, which says it is the browser's own `<select>` and not a custom dropdown.

## Accessibility

- It is a native `<select>`, so the keyboard, the picker on touch devices and screen readers all behave as users expect.
- With `label`, the label is tied to the select. Without it, pass `aria-label`, or the control has no name.
- `optional` is shown as text, not colour. A disabled select can't be focused.
- Focus and hover change the border and background, in light and dark.

## Do and don't

- Do give every select a `label` (or `aria-label`), and a disabled first `<option value="">` as a placeholder when there is no sensible default.
- Do read `event.target.value`; it is a string, so map back to numbers yourself.
- Don't use it for two options that are better shown as a [`Toggle`](../Toggle/README.md) or a `SegmentedControl`.
- Don't restyle it with `className` colours; the look comes from theme tokens.
- Don't add `<option>` children and `options` together; `children` wins.
