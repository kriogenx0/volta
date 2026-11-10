# SegmentedControl

A row of buttons where exactly one is selected: a small, always-visible choice such as Day, Week or Month.

## When to use

- **Choosing one of 2 to 5 short options** that change how the current view looks, and applying it immediately.
- Use [`RadioGroup`](../RadioGroup/README.md) for a choice submitted with a form, [`Select`](../Select/README.md) for many options, [`Toggle`](../Toggle/README.md) for a single on/off setting, and [`Tabs`](../Tabs/README.md) or [`TabBar`](../TabBar/README.md) to switch between panels of content.
- `size="sm"` and `mini` are compact versions for toolbars and dense rows.

## Usage

```jsx
import { SegmentedControl } from 'volta';

<SegmentedControl
  ariaLabel="Calendar view"
  options={[
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
  ]}
  value={view}
  onChange={setView}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `options` | `array` of `{ label, value }` | | The choices. `label` is any node; `value` must be unique, it is also the React key. |
| `value` | `any` | | The selected option's `value`. The caller holds the state; the control does not. |
| `onChange` | `function` | | With `options`: `(value)`. With `tabs`: `(index, label)`. |
| `size` | `'md'` \| `'sm'` | `'md'` | Ignored when `mini` is set. |
| `mini` | `bool` | `false` | The compact look. Works with `options` or `tabs`. |
| `disabled` | `bool` | `false` | Disables every button (button forms only). |
| `ariaLabel` | `string` | | Names the group. In the `tabs` (mini) form it falls back to "View options". |
| `navigation` | `bool` | `false` | Renders a `<nav>` for switching between pages: the selected option has `aria-current="page"` instead of `aria-pressed`. |
| `className` | `string` | | Added to the wrapper, for a view to adjust it. |
| `tabs` | `array` of `string` | | Index-based choices, as `SegmentedControlMini` always took them. |
| `selectedTabIndex` | `number` | `0` | The selected index with `tabs`. Also held by the caller. |

The selected option is marked by a highlight that slides to the new option over the global animation speed (`--v-anim-speed`); it doesn't slide on first paint, and doesn't move when the user prefers reduced motion.

Without `options` and without `mini`, `tabs` renders the legacy form: a [`TabBar`](../TabBar/README.md) styled as joined buttons, which keeps its own selection state, and `disabled`, `size` and `ariaLabel` are ignored. New code uses `options`.

## SegmentedControlMini

`SegmentedControlMini` is `<SegmentedControl mini />`, kept for the pages that import it. It takes the same props; new code writes `mini`.

## Accessibility

- With `navigation` the control is a `<nav>` and the selected button has `aria-current="page"`.
- The buttons sit in a `role="group"`; each is a native `<button>` with `aria-pressed` set to whether it is selected, so Tab and Enter or Space work. Arrow keys do not move between them.
- Always set `ariaLabel` so the group says what is being chosen.
- The selected option is shown by a raised background and darker text, not colour alone; `disabled` also dims and stops the pointer.

## Do and don't

- Do keep labels short, so the row fits a 375px screen.
- Do hold `value` in state and update it in `onChange`; the control only reports the click.
- Don't use it for navigation between pages; use [`Link`](../Link/README.md) or [`TabsRouted`](../TabsRouted/README.md).
- Don't use it for more than five options; use [`Select`](../Select/README.md).
- Don't recolour the selected state in a view's CSS; it comes from the theme tokens, in light and dark.
