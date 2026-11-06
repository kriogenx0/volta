# ProgressBar

A thin progress bar for work with a known percentage, or an animated one for work of unknown length.

## When to use

- **Progress you can measure**: an upload, an import, a step count. Pass `percent` and the bar fills to it.
- **Progress you cannot measure**: leave `percent` out (or pass `indeterminate`) and the bar animates. Add `fixed` to pin it to the top of the window as a page-level loader.
- Use [`Loader`](../Loader/README.md) for a centered spinner with a message while a section loads, and [`Slider`](../Slider/README.md) for a value the user sets. A bar is not an input.

## Usage

```jsx
import { ProgressBar } from 'volta';

<>
  <ProgressBar percent={40} />
  <ProgressBar />
  <ProgressBar variant="flowing" fixed />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `percent` | `number` \| `string` | | Progress from 0 to 100. Values are clamped, numeric strings are accepted, and anything else counts as unknown progress. |
| `indeterminate` | `bool` | inferred | When not passed, the bar is indeterminate whenever `percent` is not a number. `true` forces the animation even with a `percent`; `false` forces a plain bar (empty with no `percent`). |
| `variant` | `'bouncing'` \| `'flowing'` | `'bouncing'` | The indeterminate animation: sweeps back and forth, or always moves right. `ProgressBar.variants` lists them. |
| `fixed` | `bool` | `false` | Pins a 3px bar to the top edge of the window, above toasts and modals. |

## LoaderLinearProgress props

An older name kept for compatibility: a `ProgressBar` with `variant="flowing"` and `fixed`. Other props go to `ProgressBar` and can override those two.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `progress` | `number` | | The old name for `percent`. With none, the bar is indeterminate. |

New code uses `ProgressBar` with `fixed`.

## Accessibility

- The bar is `role="progressbar"` with `aria-valuemin` 0 and `aria-valuemax` 100. `aria-valuenow` is set for a measured bar and left off for an indeterminate one, which tells assistive tech the amount is unknown.
- It does not forward other props, so it cannot take an `aria-label`. Say in nearby text what is progressing ("Uploading 3 of 8 files, 40%").
- With `prefers-reduced-motion` an indeterminate bar fades in place instead of moving. A measured bar only changes width.
- Never use the fill alone to carry a result; show the percentage or a message too.

## Do and don't

- Do pass `percent` whenever you know it, and show the number or the step beside it.
- Do use `fixed` for one page-level bar; remove it when the work ends.
- Don't show more than one `fixed` bar at a time.
- Don't use it as a value input or a meter for a score; it shows work in progress.
- Don't leave an indeterminate bar running when nothing is happening.
