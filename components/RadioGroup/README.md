# RadioGroup

A set of radio buttons built from an options array, where exactly one option can be chosen.

## When to use

- **One choice from two to five options** that should all stay visible: a plan, a delivery method, a status. It is controlled: you hold the chosen `value` and update it in `onChange`.
- Use [`SegmentedControl`](../SegmentedControl/README.md) for a short choice that reads as a toggle bar, [`NativeSelect`](../NativeSelect/README.md) or [`ComboBox`](../ComboBox/README.md) for many options, and [`CheckboxGroup`](../CheckboxGroup/README.md) when several can be chosen.
- Use [`Radio`](../Radio/README.md) directly when you lay the options out yourself. `RadioGroup` renders one `Radio` for each option, so they look and behave the same.

## Usage

```jsx
import { RadioGroup } from 'volta';

<RadioGroup
  name="plan"
  options={[
    { label: 'Free', value: 'free' },
    { label: 'Pro', value: 'pro' },
    { label: 'Enterprise', value: 'enterprise' },
  ]}
  value={plan}
  onChange={(event) => setPlan(event.target.value)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `name` | `any` | required | Shared by every radio, so they act as one group and post under one name. |
| `options` | `{ label: string, value: any, disabled?: bool }[]` | | One [`Radio`](../Radio/README.md) each, in order. `disabled: true` dims that option and stops it being chosen. |
| `value` | `any` | | The chosen option's value. Options are matched as strings, so a number or boolean `value` still matches. With no `value` (`null` or `undefined`) nothing is checked. |
| `onChange` | `function` | | Called with the change event. `event.target.value` is always a string, so convert it back for number or boolean options. |
| `className` | `string` | | Added to the wrapper after `volta-radiogroup`. |

The wrapper is a flex row that wraps, with 12px between rows and 24px between options. There is no `disabled` prop for the whole group; disable each option, or the fieldset around it.

## Accessibility

- Each option is a `Radio`: a native radio inside a `<label>`, so the label text is the name and clicking it selects. The shared `name` gives group behaviour: Tab enters the group and the arrow keys move and choose.
- The wrapper is a plain `<div>` and `RadioGroup` takes no `aria-label`, so the group has no name. Wrap it in a `<fieldset>` with a `<legend>` (or an element with `role="radiogroup"` and a label) that states the question.

## Do and don't

- Do keep `value` in state and update it from `onChange`, or the checked radio will not move.
- Do convert `event.target.value` when the options are not strings.
- Don't use it for more than about five options; use a `NativeSelect`.
- Don't use it for a yes or no setting; use a `Toggle` or `Checkbox`.
- Don't leave `value` unset when a choice is required; start on a default.
