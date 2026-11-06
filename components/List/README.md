# List

A simple vertical list of rows, each plain text or a button, with optional section headers and selectable rows.

## When to use

- **A short list of text rows or commands.** Rows with an `action` are buttons; rows without are plain text. Use [`ListCard`](../ListCard/README.md) for a bordered card of richer rows, [`ListDefinitions`](../ListDefinitions/README.md) for label and value pairs, and [`ActionMenu`](../ActionMenu/README.md) for a menu that opens from a trigger.
- **A filter list.** Build the `<ul className="volta-list">` yourself from `ListHeader` and `FilterSectionListItem` to get a titled, single-choice list.
- It is not a form control. For picking from many options use [`Select`](../Select/README.md) or [`RadioGroup`](../RadioGroup/README.md).

## Usage

```jsx
import { List, ListHeader, FilterSectionListItem } from 'volta';

<>
  <List items={[
    { label: 'Signed in as alex@example.com' },
    { label: 'Settings', action: (index, item, event) => openSettings() },
    { label: 'Log out', action: () => logOut() },
  ]} />
  <ul className="volta-list">
    <ListHeader title="Status" />
    <FilterSectionListItem name="Open" value="open" selected={status === 'open'} onChange={setStatus} />
    <FilterSectionListItem name="Closed" value="closed" selected={status === 'closed'} onChange={setStatus} />
  </ul>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | `{ label: node, action?: function }[]` | | One row each. `action` is called with `(index, item, event)`. With no `items` the list renders nothing. |

Rows are keyed by index, so give the array a stable order.

## ListHeader props

A title row for a `.volta-list`. It renders an `<li>`, so it goes inside a `<ul className="volta-list">`.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string` | | The header text, shown small and subtle in an `<h5>`. |

## FilterSectionListItem props

A selectable row (an `<li>` holding a link) for a `.volta-list`. The parent owns which one is selected.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `name` | `string` | | The row text. |
| `value` | `any` | | Passed to `onChange` when the row is pressed. |
| `selected` | `bool` | `false` | Highlights the row and sets `aria-current="true"`. |
| `onChange` | `function` | | Called with `value`. The link's navigation is always stopped. |

## Accessibility

- A row with an `action` is a `<button type="button">`: Tab, Enter and Space work, and it shows a focus ring. A row without one is plain text and is not focusable.
- A selected `FilterSectionListItem` is marked with `aria-current="true"`; selection is also shown with a tint and weight, not colour alone.
- The list has no label of its own. When it stands alone, put a heading before it or wrap it in a labelled region.

## Do and don't

- Do give a row an `action` only when pressing it does something; only those rows react to the cursor.
- Do keep labels short and distinct ("Log out", not "Click to log out").
- Don't use `FilterSectionListItem` to navigate; it stops the link, so use `Link` for that.
- Don't use a `List` for tabular data or a long scrolling collection.
