# ComboBox

A text box that suggests values from a list as you type, and keeps whatever text you end up with.

## When to use

- **Free text with suggestions**: a city, a job title, a unit, where the list is a help and not a limit.
- A choice that must be one of the listed values is a [`NativeSelect`](../NativeSelect/README.md). Choosing several items, shown as pills, is an [`AutoComplete`](../AutoComplete/README.md) or a [`MultiSelect`](../MultiSelect/README.md).
- Options are plain strings. For `{ title, value }` options use `AutoComplete`.
- `Combobox` (lower-case b) is a legacy alias for the same component, exported from `ComboBox/ComboBox.jsx` but not from `volta`.

## Usage

```jsx
import { ComboBox } from 'volta';

<>
  <ComboBox options={['Apple', 'Apricot', 'Banana']} placeholder="Fruit" onSelect={pick} />
  <ComboBox options={cities} value={city} onChange={setCity} onCommit={saveCity} />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `options` | `array` of `string` | | The suggestions. Used in preference to `items`. |
| `items` | `array` of `string` | `[]` | Legacy name for `options`. |
| `value` | `string` | | The text. When it is given the box is controlled; without it the box keeps its own text. |
| `defaultValue` | `string` | `''` | The starting text when uncontrolled. |
| `onChange` | `function` | no-op | Called with the new text on every keystroke and when a suggestion is chosen. |
| `onSelect` | `function` | no-op | Called with the suggestion that was chosen (by click or Enter). |
| `onCommit` | `function` | | Called with the final text when a suggestion is chosen and when the box loses focus. |
| `placeholder` | `string` | | Placeholder text. |
| `disabled` | `bool` | | Native `disabled`; the list does not open. |
| `inputClassName` | `string` | `''` | Added to the `<input>`. |
| `className` | `string` | `''` | Added to the wrapper. |

## Behaviour

- The list opens when the box gets focus and shows the options that contain the typed text, ignoring case. With no text it shows all of them. It closes on Escape, on choosing, on blur and on a click outside.
- Up and Down open the list and move the highlight, wrapping at the ends. Enter chooses the highlighted option. Clicking an option chooses it.
- Choosing writes the option into the box and calls `onChange`, `onSelect` and `onCommit` in that order.
- The text is not checked against the options; the user can leave anything in the box.

## Accessibility

- It is a native text input. The suggestions are buttons in a panel under it, and nothing announces it as a combobox: there is no `role="combobox"`, no `aria-expanded` and no `aria-activedescendant`, so a screen reader does not hear the highlighted option.
- It does not forward `aria-label`, `id` or `name`, so the input's only accessible name is its placeholder. Always give a `placeholder` and a visible label beside it (a `Field`).
- Arrow keys and Enter work without a mouse. The highlight is a background change.

## Do and don't

- Do give every box a placeholder and a visible label, because that is its only name.
- Do use `onCommit` to save once, instead of saving on every `onChange`.
- Don't use it when the value must be from the list; use a `NativeSelect`.
- Don't pass objects as options; they must be strings.
- Don't use `items` in new code; use `options`.
