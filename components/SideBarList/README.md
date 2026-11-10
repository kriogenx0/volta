# SideBarList

A vertical list of choices in a side column, in labelled groups, with one current item.

## When to use

- **A side column that picks what the main area shows**: a list of components, settings sections or documents, optionally grouped.
- For a tree that opens and closes, or follows the router's current path, use [`NavSidebar`](../NavSidebar/README.md). For the top bar use [`NavBar`](../NavBar/README.md).
- For a few choices in a row use [`Tabs`](../Tabs/README.md) or `SegmentedControl`.

## Usage

```jsx
import { SideBarList } from 'volta';

<SideBarList
  ariaLabel="Components"
  groups={[
    { items: [{ value: null, label: 'All' }] },
    { label: 'Inputs', items: ['TextBox', 'ComboBox'] }
  ]}
  value={selected}
  onSelect={setSelected}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `groups` | `array` | `[]` | `[{ label, items }]`. A group without a `label` has no heading. An item is a string, or `{ value, label }` when the value that comes back differs from the text shown (or is `null`). |
| `value` | `any` | | The value of the current item. |
| `onSelect` | `function` | | Called with the value of the item that was chosen. |
| `header` | `node` | | Shown above the groups and kept at the top while the list scrolls, such as a search field. |
| `emptyMessage` | `node` | | A status line shown below the header while it is given, for a list that is empty or filtered to nothing. |
| `ariaLabel` | `string` | `'Sidebar'` | Names the navigation landmark. |
| `className` | `string` | | Added to the root, after `volta-sidebar_list`. |

Other props go to the root `<nav>`.

## Variants and states

- **Item:** a button that tints on hover; the current one is accent-coloured and medium weight.
- **Group heading:** small capitals; it is not interactive and does not react to the cursor.
- **Empty:** `emptyMessage` as a status line.

## Accessibility

- The root is a `<nav>` named by `ariaLabel`; every item is a real `<button>`, reachable by Tab and operated with Enter or Space.
- The current item has `aria-current="page"`, so it is not marked by colour alone.
- The empty message has `role="status"` so a change in what is listed is announced.

## Do and don't

- Do give each list its own `ariaLabel` when a page has more than one.
- Do keep item text short; it does not wrap onto a second line neatly.
- Don't use it for a tree or for navigation between routes; use `NavSidebar`.
- Don't put controls other than text in an item.
