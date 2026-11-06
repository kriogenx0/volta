# NavBar

A vertical, router-aware navigation list built from `NavItem` objects, with collapsible groups.

## When to use

- **The side navigation of an app or section**: a short list of pages, optionally grouped. The item matching the current path is highlighted.
- Use [`GlobalNav`](../GlobalNav/README.md) for the app's header links, [`Tabs`](../Tabs/README.md) or [`TabBar`](../TabBar/README.md) for switching between views of one page, and [`List`](../List/README.md) for a list that is not navigation.
- It must be rendered inside a react-router `Router`, because linked items use react-router's `Link` and `useLocation`.

## Usage

```jsx
import { NavBar } from 'volta';

// NavItem lives in components/NavBar/NavItem.js; it is not exported from 'volta'.
const reports = new NavItem('Reports');
reports.add(new NavItem('Weekly', '/reports/weekly'));
reports.add(new NavItem('Monthly', '/reports/monthly'));
const items = [new NavItem('Overview', '/'), reports];

<NavBar navItems={items} onActiveState={setActive} />;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `navItems` | `NavItem[]` | `[]` | The top-level items, in order. Keep them in state or memoise them: a group's open or closed state lives on its `NavItem`, so rebuilding the items resets it. |
| `onActiveState` | `function` | | Called with the `NavItem` whose link matches the current path, when it becomes active. |

## NavItem

`new NavItem(title, linkTo, key, extraClass, subHeading)`. `title` defaults to `'untitled'` and `key` to the title, so give a `key` when two items share a title.

- **With `linkTo`**, the item is a link. It is active when the location's pathname equals `linkTo` exactly. Set `item.query = { tab: 'a' }` to add a query string to the link.
- **Without `linkTo` but with children** (`item.add(child)`), the item is a group that toggles open and closed. It starts expanded; `setExpanded(false)` starts it closed.
- **With neither**, it is a plain text row.
- `extraClass` adds a class to the row. Children are indented one step per level.

## Theming

Hover and the active item use the `--v-accent` and `--v-color-*` tokens. Item and link text is currently hard-coded black, so on a dark theme it needs overriding before it can be read.

## Accessibility

- Linked items are real links (Tab, Enter). Groups are `role="button"` with `tabIndex` 0 and `aria-expanded`, toggled by click, Enter and Space; the arrow glyph is hidden from screen readers.
- The bar is a plain `<div>`, not a `<nav>`, and the active link has no `aria-current`. Wrap it in `<nav aria-label="...">`, and note the active page is shown by background and an accent edge.
- Keep link titles short and unique, since the title is the accessible name.

## Do and don't

- Do keep grouping shallow; indentation is styled for up to three levels.
- Do give each group a title that names its pages ("Reports"), and let links carry the destinations.
- Don't give a group a `linkTo`: an item with a link is a plain link and does not toggle.
- Don't rebuild the `NavItem`s on every render.
- Don't use `NavBar` outside a `Router`.
