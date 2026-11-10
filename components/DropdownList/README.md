# DropdownList

A button that opens a list of options to pick one from, showing the chosen option's label on the button.

## When to use

- **Choosing one option from a short list** where a styled popup fits better than a native control, or where picking an option should also run an action (`option.action`).
- A form field that submits a value is [`NativeSelect`](../NativeSelect/README.md). Search-as-you-type is [`ComboBox`](../ComboBox/README.md). A menu of commands, with no selection, is [`ActionMenu`](../ActionMenu/README.md).
- A panel of your own content is a [`Dropdown`](../Dropdown/README.md), which `DropdownList` is built on.

## Usage

```jsx
import { DropdownList } from 'volta';

const sorts = [
  { label: 'Newest first', value: 'new' },
  { label: 'Oldest first', value: 'old' },
];

<DropdownList
  options={sorts}
  selectedOption={sort}
  placeholder="Sort by"
  onSelect={(option) => setSort(option)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `options` | `{ label, value, action }[]` | | The choices. With none, the list shows a disabled "No options available." row. |
| `selectedOption` | `{ label, value, action }` | | Must be one of the objects in `options` (matched with `===`). It is highlighted and, with `setPlaceholder`, its label is shown on the button. The list does not remember the choice; you keep it in state. |
| `placeholder` | `string` | `'Select an option'` | The button text while nothing is selected. |
| `setPlaceholder` | `bool` | `true` | When `false` the button keeps showing `placeholder` even after a choice. |
| `onSelect` | `function` | | Called with `(option, index)` when an option is chosen. If the option has an `action`, that is called too. |
| `onToggle` | `function` | | Called with `true` or `false` each time the list opens or closes. |
| `open` | `bool` | | Leave it out and the list opens and closes itself. Pass a bool and you control it from `onToggle`. |
| `buttonComponent` | `element` | | Your own trigger, instead of the default `Button` (passed to `Dropdown`). |
| `items` | `{ label, value, action }[]` | | Legacy name for `options`. It logs a console warning; use `options`. |

The list closes after a choice, on Escape and on a click outside. It is at most 400px tall and scrolls beyond that.

## Accessibility

- The panel has `role="listbox"` and each row `role="option"` with `aria-selected`. Rows are focusable and Enter or Space chooses one; arrow keys do not move between rows, Tab does.
- The default trigger is a `Button` with `aria-haspopup` and `aria-expanded`. A custom `buttonComponent` has to set them itself.
- The selected row is marked by a highlight and `aria-selected`; the button label also shows the choice.
- Option labels are plain strings. Keep them short: rows do not wrap.

## Do and don't

- Do keep `selectedOption` in state and pass back the same object from `options`; a copy of it is not highlighted.
- Do write a `placeholder` that names what is being chosen ("Sort by").
- Don't use it for long lists or for choices a user needs to search; use `ComboBox`.
- Don't put a destructive `action` in an option without a confirmation.
- Don't use `items`; it is kept for old code.
