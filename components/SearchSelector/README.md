# SearchSelector

A popover with a search box: type to search, click a result to add it to the selection.

## When to use

- **Picking one or several items from a list too long to scroll,** where the matches come from a function you supply (a local filter, for example).
- Use [`Select`](../Select/README.md) for a short list, [`ComboBox`](../ComboBox/README.md) or [`AutoComplete`](../AutoComplete/README.md) to search inside a field without a popover, and [`MultiSelect`](../MultiSelect/README.md) to tick several from a short list.
- You open it yourself (for instance from a [`Button`](../Button/README.md)) with `open`; it has no trigger of its own.

## Usage

```jsx
import { SearchSelector, Button } from 'volta';

<>
  <Button onClick={() => setOpen(true)}>Choose fruit</Button>
  <SearchSelector
    open={open}
    onType={(query) => fruits.filter((fruit) => fruit.toLowerCase().includes(query.toLowerCase()))}
    onChange={setSelected}
    onClose={() => setOpen(false)}
  />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `open` | `bool` | `false` | Shows the popover. When it changes, the popover follows it. |
| `onType` | `function` | | `(query) => items`, called on every keystroke. It must return an array synchronously (strings are what the result buttons show); nothing is listed until the user types. |
| `onChange` | `function` | | Called with the whole array of selected items each time a result is clicked. |
| `onClose` | `function` | | Called when the popover is dismissed (Escape or a click outside). |
| `multipleItems` | `bool` | `true` | `false` keeps one item: each click replaces the selection. |
| `uniqueItems` | `bool` | `true` | With `multipleItems`, ignores a click on an item that is already selected. |

The selection is kept inside the component while it stays mounted and is shown as chips above the results; there is no way to remove one from here. Clicking a result does not close the popover. Set your `open` state to `false` in `onClose`, otherwise the popover can't be opened again.

## Accessibility

- The popover is a `role="dialog"` labelled "Search"; the search box has the label "Search" too.
- Results are real `<button>` elements, reachable by Tab and operable by Enter and Space. Escape closes the popover.
- Focus is not moved into the popover when it opens or back to the opener when it closes; the caller's button stays where it was.

## Do and don't

- Do keep `onType` fast and synchronous; filter a list you already have.
- Do show the final selection somewhere in the page too, since the chips only appear inside the popover.
- Don't use it for a handful of choices; a [`Select`](../Select/README.md) is quicker.
- Don't open it on page load; it covers the window with a backdrop.
- Don't pass objects as items unless they render as text; each item is shown as is in a button.
