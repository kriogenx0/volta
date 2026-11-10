# List

A vertical list of rows, each plain text or a button, with optional section headers and selectable rows. With `card` it is the same list in a bordered card, and `ListCard` is another name for that.

## When to use

- **A short list of text rows or commands.** Rows with an `action` are buttons; rows without are plain text. Add `card` for a bordered card with dividers, and write richer rows as `ListRow`s. Use [`ListDefinitions`](../ListDefinitions/README.md) for label and value pairs, and [`ActionMenu`](../ActionMenu/README.md) for a menu that opens from a trigger.
- **A filter list.** Build the `<ul className="volta-list">` yourself from `ListHeader` and `FilterSectionListItem` to get a titled, single-choice list.
- It is not a form control. For picking from many options use [`NativeSelect`](../NativeSelect/README.md) or [`RadioGroup`](../RadioGroup/README.md).

## Usage

```jsx
import { List, ListRow, ListHeader, FilterSectionListItem } from 'volta';

<>
  <List card>
    <ListRow onClick={updateCard}><span>Update payment method</span><span>Visa 4242</span></ListRow>
    <ListRow as="div"><span>Plan</span><span>Team</span></ListRow>
  </List>
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
| `items` | `{ label: node, action?: function }[]` | | One row each. `action` is called with `(index, item, event)`. |
| `children` | `node` | | `ListRow`s (or `ListHeader` and `FilterSectionListItem`), used when there are no `items`. With neither `items` nor `children` the list renders nothing. |
| `card` | `bool` | `false` | Draws the list in a bordered, rounded card with a divider between rows and 12px by 16px of room in each; each row is a flex line with its parts spread apart (a label and a value or hint), so wrap each part in its own element. |
| `className` | `string` | | Added to the `<ul>` after `volta-list`. |

Rows are keyed by index, so give the array a stable order.

## ListRow props

A row you write yourself, for content more than a label. It renders an `<li>` that holds a `<button type="button">` or, with `as="div"`, a static `<div>`.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `as` | `'button'` \| `'div'` | `'button'` | `'button'` is clickable and reacts to the cursor; `'div'` is a static row. |
| `onClick` | `function` | | Called when a button row is pressed. Ignored by `as="div"`. |
| `className` | `string` | | Added to the `<li>` after `lst_row`. |
| `children` | `node` | | The row content. |

## ListCard and ListCardRow

`ListCard` is `<List card />`, and `ListCardRow` is a `ListRow`: they take the same props, kept for existing code. New code writes `<List card>` and `<ListRow>`.

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

- A row with an `action` (or a button `ListRow`) is a `<button type="button">`: Tab, Enter and Space work, and it shows a focus ring. A row without one is plain text and is not focusable. The text is its accessible name, so make it say what the row does ("Update payment method"); a `ListRow` does not forward other props such as `aria-label`.
- A selected `FilterSectionListItem` is marked with `aria-current="true"`; selection is also shown with a tint and weight, not colour alone.
- The list has no label of its own. When it stands alone, put a heading before it or wrap it in a labelled region.

## Do and don't

- Do give a row an `action` only when pressing it does something; only those rows react to the cursor.
- Do keep labels short and distinct ("Log out", not "Click to log out").
- Don't use `FilterSectionListItem` to navigate; it stops the link, so use `Link` for that.
- Don't use a `List` for tabular data or a long scrolling collection.
- Do use `as="div"` for any `ListRow` that is not pressable, so it does not look or behave clickable.
- Don't leave a button row without an `onClick`; it is still styled and focusable but does nothing.
- Don't nest buttons or links inside a button row.
