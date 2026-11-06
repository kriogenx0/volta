# TabsRouted

A row of tabs that are router links: the tab matching the current URL is the active one.

## When to use

- **Sections of a page that each have their own URL** (`/settings/profile`, `/settings/billing`), so they can be linked to, bookmarked and used with the back button.
- Use [`TabBar`](../TabBar/README.md) when the tabs switch panels in place without changing the URL, and [`Link`](../Link/README.md) or [`NavBar`](../NavBar/README.md) for navigation that isn't a set of sibling tabs.
- It needs a React Router context: render it inside a router (`BrowserRouter`, `MemoryRouter`, ...). The routes and the content under each tab are yours.

## Usage

```jsx
import { TabsRouted } from 'volta';

<TabsRouted
  tabs={[
    { path: '/', name: 'Overview' },
    { path: '/reports', name: 'Reports' },
    { path: '/settings', name: 'Settings' }
  ]}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `tabs` | `array` of `{ path, name }` | | One entry per tab. `path` (string, required) is the link target; `name` (node, required) is the label. |

A tab is active on its path and on any URL beneath it, except `/`, which is active only on the root itself. The active link gets the `is-active` class and, from React Router's `NavLink`, `aria-current="page"`.

## Accessibility

- Each tab is a real link inside a list, so Tab and Enter work and screen readers announce the current page through `aria-current="page"`.
- The row is not wrapped in a `nav`, and it has no label of its own. Wrap it in `<nav aria-label="...">` when it is a page-level navigation.
- Visually the active tab differs only by a darker text colour (and a default cursor); assistive technology gets the state from `aria-current`. Also show the current section in the page heading.

## Do and don't

- Do keep a stable list of tabs with short names.
- Do give each tab its own route, so the URL says where the user is.
- Don't use it to switch panels in place; use [`TabBar`](../TabBar/README.md).
- Don't render it outside a router; `NavLink` will throw.
- Don't use more than a handful of tabs; on a narrow screen they wrap onto more lines.
