# ListDefinitions

A definition list that shows an object as label and value rows, such as a record's details or build metadata.

## When to use

- **Read-only key and value details**: a profile, a version, an order summary. The object's keys become the labels and its values the content.
- Use [`ListCard`](../ListCard/README.md) when the rows are pressable or need a card around them, [`List`](../List/README.md) for a plain list of items, and a form (`Field` with an input) when the user can edit the values.
- Keys are shown as written, in the object's order, so pass display-ready labels (`'Last Updated'`, not `last_updated`).

## Usage

```jsx
import { ListDefinitions } from 'volta';

<ListDefinitions data={{
  Name: 'Alex Johnson',
  Role: 'Product Designer',
  Team: 'Platform',
  'Last Updated': '2026-05-19',
}} />;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `data` | `object` | | Label to value pairs. Each key is a `<dt>` and each value a `<dd>`; values can be text or elements. With no `data` the list is empty. |

The component declares no `propTypes`. Each pair is one line: the label takes about a third of the width and the value the rest.

## Accessibility

- It renders a native `<dl>` with `<dt>` and `<dd>` pairs, which screen readers announce as a list of terms and definitions.
- Labels use the subtle text colour; the values carry the information, so never put something essential only in a label's colour.
- It has no label of its own. Put a heading before it when it stands alone.

## Do and don't

- Do give every value something to read; show a dash or "None" instead of an empty value.
- Do keep labels short and consistent across lists on the same screen.
- Don't use it for tabular data with many columns; use a table.
- Don't put controls in the values to build a form; use `Field` and the form controls.
- Don't rely on object key order for meaning when a key looks like a number: JavaScript lists numeric-looking keys first.
