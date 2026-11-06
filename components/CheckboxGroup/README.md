# CheckboxGroup

A set of checkboxes built from an array of options, with the ticked values held in one array.

## When to use

- **Choosing any number of options from a short fixed list** (days of the week, notification types).
- A single yes/no is a [`Checkbox`](../Checkbox/README.md). One choice from several is a [`RadioGroup`](../RadioGroup/README.md) or [`SegmentedControl`](../SegmentedControl/README.md).
- Many options, or options the user can search and add to, are a [`MultiSelect`](../MultiSelect/README.md) or an [`AutoComplete`](../AutoComplete/README.md).

## Usage

```jsx
import { CheckboxGroup } from 'volta';

<CheckboxGroup
  name="days"
  options={[
    { label: 'Monday', value: 'mon' },
    { label: 'Tuesday', value: 'tue' },
    { label: 'Wednesday', value: 'wed' }
  ]}
  value={days}
  onChange={toggleDay}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `name` | `any` | | Required. The `name` of every checkbox in the group. |
| `options` | `array` of `{ label, value }` | | One checkbox per option. `label` is a string; `value` can be anything. |
| `value` | `array` | | The values that are ticked. A checkbox is ticked when its option's `value` is in this array. |
| `onChange` | `function` | | Called with the native change event of the checkbox that was clicked. |
| `className` | `string` | | Added to the wrapper after `volta-checkboxgroup`. |

Any other prop (`disabled`, for example) is passed to every checkbox in the group.

## Behaviour

- It is controlled only. The group keeps no state: it ticks what `value` says, so with no `value` nothing is ticked and clicks change nothing until you pass one.
- `onChange` gets the event, not the new array. Read `e.target.checked` to see whether the box was ticked and `e.target.value` for which one, and build the next array in your own code. `e.target.value` is always a string, so look the option up by `String(option.value)` when values are numbers.
- The boxes lay out in a wrapping row with 12px and 24px gaps.

## Accessibility

- Each option is a [`Checkbox`](../Checkbox/README.md) with its own label, so each one is named and works with Tab and Space.
- The wrapper is a plain `<div>` with no role and no name, so the group itself is not announced. Give the question a visible heading with a `Field`, or put the group in a `fieldset` with a `legend`.

## Do and don't

- Do give each option a short, distinct label.
- Do keep `value` in state and update it from `onChange`.
- Don't use it for a single option; use a `Checkbox`.
- Don't pass two options with the same `value`; they would tick together.
- Don't use `e.target.value` as your stored value for numbers or booleans without converting it.
