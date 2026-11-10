# Tabs

A row of tabs for switching between panels, or between sections that each have their own URL. `TabBar` and `TabsRouted` are other names for it.

## When to use

- **Switching between views of the same content** on one page (Overview, Activity, Settings), where your code shows the panel that matches the selected tab.
- **Sections of a page that each have their own URL** (`/settings/profile`, `/settings/billing`): give the tabs a `path` and they become router links, so they can be linked to, bookmarked and used with the back button.
- Use [`SegmentedControl`](../SegmentedControl/README.md) for a compact choice that changes how a view looks, and [`Link`](../Link/README.md) or [`NavBar`](../NavBar/README.md) for navigation that isn't a set of sibling tabs.
- `Tabs` draws only the row. It does not render panels, and the routes and content under routed tabs are yours.

## Usage

```jsx
import { Tabs } from 'volta';

<>
  <Tabs
    tabs={['Overview', 'Activity', 'Settings']}
    selectedTabKey={selectedKey}
    onSelect={(key, label) => setSelectedKey(key)}
  />
  <Tabs
    tabs={[
      { path: '/', name: 'Overview' },
      { path: '/reports', name: 'Reports' },
      { path: '/settings', name: 'Settings' }
    ]}
  />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `tabs` | `array` \| `object` | | The tabs. A tab is a string or other node, an element with a `label` prop (the label is what is shown and reported), or a `{ path, name }` pair for a router link. An array's keys are its indexes; an object's keys are its own keys and its values the tabs. |
| `selectedTabKey` | `string` \| `number` | | The key of the selected tab (an index for an array). The caller decides: a click only calls `onSelect`. |
| `selectedTabIndex` | `number` | | The index to start on, and to move to when the prop changes. Clicks also move the selection, so the caller need not track it. |
| `onSelect` | `function` | | Called with `(key, tab)` when a tab is chosen, including the one already selected. |
| `onChange` | `function` | | Called with `(index, label)` at the same moment. |
| `align` | `string` | `'left'` | `'right'` pushes the tabs to the right edge (case-insensitive). Any other value leaves them at the left. |

With neither `selectedTabKey` nor `selectedTabIndex` the first tab starts selected and clicks move it. Routed tabs ignore all three: the router says which is selected. A routed tab is selected on its path and on any URL beneath it, except `/`, which is selected only on the root itself.

## TabBar

`TabBar` is `Tabs` itself (`TabBar === Tabs`), kept for existing code: it took `tabs`, `selectedTabIndex` and `onChange`, which `Tabs` takes too. New code uses `Tabs`.

## TabsRouted

`TabsRouted` is `Tabs` itself (`TabsRouted === Tabs`), kept for existing code. Give `tabs` as `{ path, name }` pairs. It must be rendered inside a router (`BrowserRouter`, `MemoryRouter`, ...) when any tab has a `path`.

## Accessibility

- Without routed tabs the row is an ARIA tab list: each tab is `role="tab"` with `aria-selected`, only the selected one is in the tab order, the arrow keys move focus between tabs (wrapping at the ends), Home and End jump to the ends, and Enter or Space chooses the focused one. The arrows only move focus; they do not choose.
- There are no `tabpanel` roles: label your panel yourself if you need the association, for example with `aria-labelledby` pointing at the tab.
- Routed tabs are real links in a list, so Tab and Enter work, and the current page is announced with `aria-current="page"`. The row is inside a `nav`; give it a name with a wrapping `<nav aria-label="...">` when it is the page's main navigation.
- The selected tab is shown by its accent colour and bottom border, and assistive technology gets the state from `aria-selected` or `aria-current`. Also show the current section in the page heading.
- The selected tab is underlined by a bar that slides and resizes to the tab you choose, at the global animation speed (`--v-anim-speed`); it does not slide on first paint, and holds still for reduced motion. The bar is decorative (`aria-hidden`).
- Every tab shows a ring when focused with the keyboard, and the unselected ones darken on hover.

## Do and don't

- Do keep labels short, so the row fits a 375px screen without wrapping.
- Do put the selected key in state and pass it back as `selectedTabKey` when something else (a URL, a form step) can change it.
- Do give each routed tab its own route, so the URL says where the user is.
- Don't add more than a handful of tabs; use [`NativeSelect`](../NativeSelect/README.md) for long lists.
- Don't mix routed and in-place tabs in one row.
- Don't render routed tabs outside a router; `NavLink` will throw.
- Don't recolour the selected tab in a view's CSS; it comes from the theme tokens.
