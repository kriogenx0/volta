# Tabs

A horizontal row of text tabs with a bottom rule, for switching between panels; the older tab row, kept for existing pages.

## When to use

- **Existing screens that already use it.** Its tabs are list items with a click handler, so a keyboard user can't reach them (see Accessibility).
- For new work use [`TabBar`](../TabBar/README.md) to switch panels on one page, or [`TabsRouted`](../TabsRouted/README.md) when each tab is a URL.
- Use [`SegmentedControl`](../SegmentedControl/README.md) for a compact choice that changes how a view looks.
- `Tabs` draws only the row. It does not render panels.

## Usage

```jsx
import { Tabs } from 'volta';

<Tabs
  tabs={['Overview', 'Details', 'Activity']}
  selectedTabKey={selectedKey}
  onSelect={(key, label) => setSelectedKey(key)}
  align="right"
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `tabs` | `array` \| `object` | | The labels. An array's keys are its indexes; an object's keys are its own keys and its values the labels. Labels double as React keys, so keep them unique. |
| `selectedTabKey` | `string` \| `number` | | The key of the selected tab: an index (a number) for an array. The caller holds it; the row has no state of its own. |
| `onSelect` | `function` | | Called with `(key, label)` when a tab is clicked. |
| `align` | `string` | `'left'` | `'right'` pushes the tabs to the right edge (case-insensitive). Any other value leaves them at the left. |
| `activeClassName` | `string` | | Declared but not used by the component; it has no effect. |

## Accessibility

- Each tab is an `<li>` with a click handler: no role, no `tabindex`, no key handler. It can't be focused or operated from the keyboard, and a screen reader announces plain list items with no selected state.
- The selected tab is shown only by its colour and bottom border.
- If you must use it, offer another way to reach each panel, or switch to [`TabBar`](../TabBar/README.md), which uses real buttons.

## Do and don't

- Do pass `selectedTabKey` and update it in `onSelect`; the row does not remember the selection.
- Do move to [`TabBar`](../TabBar/README.md) when you change a screen that uses it.
- Don't add it to new screens; it fails keyboard and screen-reader use.
- Don't use it for navigation between pages; use [`TabsRouted`](../TabsRouted/README.md) or [`Link`](../Link/README.md).
- Don't pass `activeClassName` expecting it to style the active tab; nothing reads it.
