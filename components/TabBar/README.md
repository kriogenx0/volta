# TabBar

A row of tab buttons that tracks which one is selected, with an underline on the active tab.

## When to use

- **Switching between views of the same content** on one page (Overview, Activity, Settings), where your code shows the panel that matches the selected tab.
- Use [`TabsRouted`](../TabsRouted/README.md) when each tab is its own URL, [`SegmentedControl`](../SegmentedControl/README.md) for a compact choice that changes how a view looks, and [`Tabs`](../Tabs/README.md) only for existing pages that already use it.
- `TabBar` draws only the row. It does not render panels.

## Usage

```jsx
import { TabBar } from 'volta';

<TabBar
  tabs={['Overview', 'Activity', 'Settings']}
  selectedTabIndex={index}
  onChange={(newIndex, label) => setIndex(newIndex)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `tabs` | `array` | | Strings, or elements with a `label` prop (the label is what is shown and reported). |
| `selectedTabIndex` | `number` | `0` | The selected tab. TabBar keeps its own selection too, and follows this prop when it changes. |
| `onChange` | `function` | | Called with `(index, label)` when a tab is clicked, including the one already selected. |

`TabBar.Link` is the single tab button (`active`, `label`, `onClick`) that `TabBar` renders for each entry; use it only when building a custom row.

## Accessibility

- Each tab is a native `<button>`, so Tab and Enter or Space work and the focus ring is visible. The active one has `aria-current="true"`.
- It is a row of buttons, not the ARIA tablist pattern: there are no `tab` or `tabpanel` roles and arrow keys do not move between tabs. If you need a panel association, label the panel yourself (for example `aria-labelledby` pointing at the heading it shows).
- The active tab is marked by an underline and accent colour, not colour alone.
- Tab labels are the accessible names, so make each say what it shows.

## Do and don't

- Do keep labels short, so the row fits a 375px screen without wrapping.
- Do put the selected index in state and pass it back as `selectedTabIndex` when something else (a URL, a form step) can change it.
- Don't use it for navigation between pages; use [`TabsRouted`](../TabsRouted/README.md) or [`Link`](../Link/README.md).
- Don't add more than a handful of tabs; use [`Select`](../Select/README.md) for long lists.
- Don't recolour the active tab in a view's CSS; it comes from the `--v-accent` token.
