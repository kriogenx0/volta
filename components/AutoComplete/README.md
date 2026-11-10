# AutoComplete

A search-as-you-type box for choosing one or several items from a list, shown as removable pills.

## When to use

- **Picking several items from a long list** (people, tags, recipients) where a `NativeSelect` would be unwieldy. With `limit={1}` it is a single-choice search box.
- **Letting the user add their own entry** (`allowAdd`) or recognising email addresses as they type (`detect="email"`).
- One choice from a short list is a [`NativeSelect`](../NativeSelect/README.md). A text field that only suggests values, and keeps whatever is typed, is a [`ComboBox`](../ComboBox/README.md).
- It works on a plain array of options held in memory. There is no remote store and no custom row rendering.

## Usage

```jsx
import { AutoComplete } from 'volta';

<AutoComplete
  options={[{ title: 'Ada Lovelace', value: 1 }, { title: 'Grace Hopper', value: 2 }]}
  selected={people}
  onChange={setPeople}
  placeholder="Add people"
  aria-label="People"
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `options` | `array` of `{ title, value }` | `[]` | What can be chosen. `value` must be unique. Typing fuzzy-matches `title`, results sorted A to Z. |
| `selected` | `array` of `{ title, value }` | `[]` | The chosen items. The box takes it whenever the parent passes a different array, so keep one array between renders. |
| `onChange` | `function` | no-op | Called with the whole new chosen array each time it changes. |
| `limit` | `number` | `Infinity` | How many can be chosen. At the limit the text box is hidden. `1` makes it single-choice: choosing replaces, and the list offers "Clear selection". |
| `allowAdd` | `bool` | `false` | Offers "Add "text"" for what was typed. Enter adds `{ title: text, value: text }`. |
| `onAdd` | `function` | no-op | Called with the typed text after `allowAdd` added it. |
| `detect` | `'email'` | `null` | Adds a valid email address on Enter or Space. |
| `isValidResult` | `function` | accepts all | `(option) => bool`; options it rejects are not listed. |
| `formatAddMessage` | `function` | `Add "text" (press enter)` | `(text) => node`, the text of the add link. |
| `footerTitle` | `string` | `null` | Text of a link at the bottom of the list. |
| `onFooterClick` | `function` | no-op | Called when the footer link is clicked. |
| `onFocus` | `function` | no-op | Called when the text box gets focus. |
| `placeholder` | `string` | `null` | Shown until the limit is reached. Also the box's name when there is no `aria-label`. |
| `aria-label` | `string` | | Names the text box for assistive tech. |
| `name` | `string` | `null` | A hidden input with this name carries the chosen values joined by commas, for a native form post. |
| `compact` | `bool` | `false` | Tighter rows in the list. |
| `className` | `string` | `''` | Added to the root. |

## Accessibility

- The text box is `role="combobox"` with `aria-expanded`, `aria-controls` and `aria-activedescendant`; the list is a `listbox` of `option` rows.
- Up and Down move through the list, Enter chooses the highlighted row (or adds, with `allowAdd` or `detect`), and Escape closes it. Backspace in an empty box highlights the last pill, and a second press removes it.
- Each pill has a remove button named "Remove <title>". With `limit={1}` there is none; use "Clear selection".
- Always pass `aria-label` or at least a `placeholder`, or the box has no name. Put a visible label next to it with `Field`.
- Rows are chosen on mouse press, so the text box keeps focus while the list is used.

## Do and don't

- Do give every option a stable, unique `value`.
- Do keep `selected` in state and pass the same array back until it changes.
- Don't use it for a short list; a `NativeSelect` or checkboxes are simpler.
- Don't pass `selected={[]}` inline; a new array each render resets the box.
