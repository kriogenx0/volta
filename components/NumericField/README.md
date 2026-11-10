# NumericField

A number input that blocks non-numeric typing and formats its value when the user leaves the field.

It is a [`TextBox`](../TextBox/README.md) that overrides the typing, focus and blur handling, so it also takes `label`, `hint`, `error`, `optional` and `fieldSize`, and works inside a `Field`.

## When to use

- **A quantity, price or measurement** the user types as a number. Pick how it is shown with `onBlurFormat`, and read the result in `onBlurChange`.
- Use [`TextBox`](../TextBox/README.md) for text and for numbers that are really identifiers (phone numbers, postal codes, IDs), because formatting drops leading zeros. Use [`Slider`](../Slider/README.md) to pick a value from a range by dragging.
- It is a bare input. Put it in a [`Field`](../Field/README.md) for a visible caption, and give it `aria-label`.

## Usage

```jsx
import { NumericField } from 'volta';

<NumericField
  aria-label="Price"
  value={price}
  min={0}
  step={0.01}
  onBlurFormat="twoDecimal"
  onChange={(typed) => setTyping(typed)}
  onBlurChange={(next, previous) => setPrice(next)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` \| `number` | | The value. It is formatted when rendered, when it changes and on blur. |
| `onBlurFormat` | `'integer'` \| `'twoDecimal'` \| numeral format \| `function` | `'integer'` | How the value is formatted on blur and at the start. `'integer'` rounds to a whole number. A string that is not a built-in name is a numeral.js format such as `'0.0'`; a function takes the value and returns the text to show. |
| `format` | same as `onBlurFormat` | | Deprecated alias for `onBlurFormat`. |
| `whenTypingFormat` | `string` \| `number` \| `function` | digits and one `.` | Runs on each change; return the text to keep, or `null` to reject the keystroke. The default accepts only digits and one decimal point, so a minus sign is rejected. |
| `onChange` | `function` | | Called with the text (not an event) after each accepted change. |
| `onBlur` | `function` | | Called with the formatted value when the field loses focus. |
| `onBlurChange` | `function` | | Called on blur with `(newValue, valueAtFocus)`, only when the value changed. |
| `onFocus` | `function` | | Called on focus with the field's text and its text at the previous focus. |
| `focusValue` | `string` \| `number` | | Replaces the shown text the first time the field is focused. |

Any other prop goes to the `<input type="number">` (`min`, `max`, `step`, `name`, `disabled`, `placeholder`, `aria-label`, `className`, ...). `min` and `max` guide the spinner and form validation; the field does not clamp what is typed. With the built-in formats an empty value becomes `0` on blur. `NumericField.formats` holds the built-in format functions.

## Accessibility

- It is a native number input, so a screen reader announces a spin button, and Up and Down change the value by `step`.
- It has no label of its own. Set `aria-label`: a `Field`'s `label` is a visible caption and is not linked to the input.
- Rejected keystrokes are silent. State the allowed range or format in the label or hint rather than relying on the block.

## Do and don't

- Do set `onBlurFormat` when decimals matter; the default rounds to a whole number.
- Do keep the committed value in state from `onBlurChange`, and use `onChange` only to react while typing.
- Don't use it for negative numbers without a `whenTypingFormat` that allows `-`.
- Don't use it for IDs, phone or postal codes; use a `TextBox`.
