# Slider

A horizontal slider for picking a number in a range by dragging a thumb, clicking the track or using the keyboard.

## When to use

- **A value on a scale** where the rough position matters more than the exact number: volume, zoom, a rating from 1 to 5.
- Use [`NumericField`](../NumericField/README.md) when the user needs to type an exact number, and pair the two when both matter. Use [`NativeSelect`](../NativeSelect/README.md) or [`SegmentedControl`](../SegmentedControl/README.md) for a few named choices, and [`ProgressBar`](../ProgressBar/README.md) to show progress the user doesn't set.
- Always show the current value near it as text when it matters; the slider doesn't print it.

## Usage

```jsx
import { Slider } from 'volta';

<Slider ariaLabel="Volume" min={0} max={100} step={1} value={volume} onChange={setVolume} />;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `number` | | The controlled value. Leave it undefined for an uncontrolled slider. Clamped to `min` and `max`. |
| `defaultValue` | `number` | the middle of the range | Where an uncontrolled slider starts. |
| `min` | `number` | `0` | |
| `max` | `number` | `2` | Not 100: set `max` for any other range. |
| `step` | `number` | | Snaps to multiples of `step` from `min`, and the keyboard moves by it. Without it the value is continuous. |
| `disabled` | `bool` | `false` | Dimmed, ignores the pointer and the keyboard, and leaves the tab order. |
| `ariaLabel` | `string` | | Names the slider for screen readers. |
| `onChange` | `function` | | Called with the new number, only when it actually changes. A controlled slider shows it only once you pass it back as `value`. |

## Accessibility

- The thumb is a `role="slider"` with `aria-valuemin`, `aria-valuemax` and `aria-valuenow`, in the tab order. It sets `aria-disabled` when disabled.
- Keyboard: Right and Up add one step, Left and Down subtract one, Page Up and Page Down move ten steps, Home and End jump to `min` and `max`. Without `step`, one step is 1/100 of the range.
- Always pass `ariaLabel`; there is no visible label of its own. Show the value as text next to it, since `aria-valuenow` is a bare number with no unit.
- The whole padded box is the touch and click target, and the thumb shows a ring on hover and focus. It works with a finger without scrolling the page.

## Do and don't

- Do set `min`, `max` and `step` explicitly; the defaults (0 to 2) rarely match what you want.
- Do show the current value, and its unit, in text.
- Don't use it where exact numbers matter and there is no way to type one.
- Don't pack it edge to edge on a phone; a touch that starts on the slider drags it instead of scrolling the page, so leave room around it to scroll.
- Don't recolour the fill or thumb; they use `--v-accent`, which follows the runtime accent.
