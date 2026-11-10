# MultiSelect

A searchable select, built on react-select, for choosing several options (or one) from a list.

## When to use

- **Picking several items from a longer list**, with search: teams, tags, recipients. The chosen options show as removable chips.
- Use [`NativeSelect`](../NativeSelect/README.md) for one choice from a list, [`CheckboxGroup`](../CheckboxGroup/README.md) for a few options that should all stay visible, [`ComboBox`](../ComboBox/README.md) when the user types free text and picks a suggestion, and [`TagInput`](../TagInput/README.md) for tags the user types.
- Pass `multiselect={false}` for a single choice; `onChange` still gets an array (of one).

## Usage

```jsx
import { MultiSelect } from 'volta';

<MultiSelect
  aria-label="Teams"
  name="teams"
  placeholder="Choose teams"
  options={[
    { label: 'Design', value: 'design' },
    { label: 'Engineering', value: 'eng' },
    { label: 'Support', value: 'support' },
  ]}
  defaultValue={[{ label: 'Engineering', value: 'eng', fixed: true }]}
  clearable
  onChange={(selected, event) => setTeams(selected)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `options` | `{ label: string, value: any }[]` | | The choices. Chosen options are hidden from the open list. |
| `aria-label` | `string` | | Names the search input for assistive tech. Always give one. |
| `defaultValue` | `{ label, value, fixed? }[]` | `[]` | Options selected at the start. A non-empty `value` wins over it at the start. |
| `value` | `{ label, value, fixed? }[]` | `[]` | Selected options. When it changes (compared by content) the selection follows it. |
| `onChange` | `function` | | Called with `(selectedArray, event)`; `event` is react-select's action info. |
| `multiselect` | `bool` | `true` | `false` makes it a single choice, still reported as an array. |
| `clearable` | `bool` | `false` | Shows a clear control. Clearing keeps the `fixed` options from `defaultValue`. |
| `disabled` | `bool` | | Disables the control. |
| `placeholder` | `string` | react-select's | Shown while nothing is selected. |
| `noOptionsMessage` | `string` | `'No options available'` | Shown when no option matches. |
| `name` | `string` | | The `name` of react-select's hidden input, for form posts. |
| `className` | `string` | | Added to the root, after `volta-multi_select`. |
| `classNamePrefix` | `string` | `'multi-select'` | Prefix for react-select's inner class names, for styling. |

An option with `fixed: true` is shown first and cannot be removed or cleared. The selection is kept in the component's state: it starts from `value` or `defaultValue`, and a changed `value` prop replaces it. Update `value` from `onChange` to keep a parent in step.

## Theming

Colours come from the `--v-*` tokens through `styles/_shared/colors.js`, so the control follows the active theme and accent. Style inner parts with the `multi-select__` class names.

## Accessibility

- react-select provides the combobox behaviour: type to filter, Up and Down to move, Enter to choose, Backspace to remove the last chip, Escape to close the list.
- Give `aria-label` for every instance. It has no `inputId`, so a `<label for>` cannot point at it.
- Chosen options are chips with a remove control; a `fixed` option has none, and the clear control appears only with `clearable`.

## Do and don't

- Do give every option a readable `label` and a stable `value`.
- Do use `fixed` for options the user must keep rather than hiding the remove control yourself.
- Don't use it for two or three options; a [`CheckboxGroup`](../CheckboxGroup/README.md) shows them all.
- Don't expect `onChange` to give a bare value; it always gives an array of `{ label, value }` objects.
