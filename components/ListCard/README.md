# ListCard

A bordered card of stacked rows, each a clickable button or a static line of information.

## When to use

- **A short group of related rows**, such as settings, accounts or account actions, where each row can be pressed. Rows are buttons by default; use `as="div"` for rows that only show information.
- Use [`List`](../List/README.md) for a plain, borderless list, [`ListDefinitions`](../ListDefinitions/README.md) for label and value metadata, and [`Card`](../Card/README.md) for a general container.
- Keep to one purpose per card; start a second `ListCard` for an unrelated group.

## Usage

```jsx
import { ListCard, ListCardRow } from 'volta';

<>
  <ListCard>
    <ListCardRow as="div"><span>Plan</span><span>Team</span></ListCardRow>
    <ListCardRow as="div"><span>Seats</span><span>12</span></ListCardRow>
  </ListCard>
  <ListCard>
    <ListCardRow onClick={updateCard}><span>Update payment method</span></ListCardRow>
    <ListCardRow onClick={downloadInvoices}><span>Download invoices</span></ListCardRow>
  </ListCard>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `node` | | The rows, usually `ListCardRow`s. A divider is drawn between neighbours. |

## ListCardRow props

A row is a flex line with space between its children (typically a label and a value or hint), so wrap each part in its own element.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `as` | `'button'` \| `'div'` | `'button'` | `'button'` is a clickable `<button type="button">`; `'div'` is a static row. |
| `onClick` | `function` | | Called when a button row is pressed. Ignored by `as="div"`. |
| `className` | `string` | | Added to the row's classes. |
| `children` | `node` | | The row content. |

## Accessibility

- A button row is a real `<button>`: Tab, Enter and Space work and it shows a focus ring. A static row is plain text and is not focusable.
- The row's text is its accessible name, so make it say what the row does ("Update payment method"). `ListCardRow` does not forward other props such as `aria-label`, so give every row text.
- Only button rows change on hover; static rows stay still.

## Do and don't

- Do use `as="div"` for any row that is not pressable, so it does not look or behave clickable.
- Do put the label first and the current value or hint second, as the examples do.
- Don't leave a button row without an `onClick`; it is still styled and focusable but does nothing.
- Don't nest buttons or links inside a button row.
