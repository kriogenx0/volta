# NativeSlider

The browser's own range input (`<input type="range">`), styled to match [`Slider`](../Slider/README.md).

## When to use

- **A setting on a range where the browser's own behaviour is wanted:** its keyboard, touch and screen reader support, and step snapping. The styleguide's animation speed control in the top bar is one.
- For a slider that animates to where it is clicked, or that must look identical in every browser's track, use [`Slider`](../Slider/README.md).
- For a few named choices use `SegmentedControl` or `RadioGroup`; for a typed number use [`NumericField`](../NumericField/README.md).

## Usage

```jsx
import { NativeSlider } from 'volta';

<NativeSlider aria-label="Animation speed" min={0} max={500} step={10} value={speed} onChange={setSpeed} />;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `number` | | The current value. When it is given the slider is controlled. |
| `defaultValue` | `number` | | The starting value of an uncontrolled slider. |
| `min` | `number` | `0` | The lowest value. |
| `max` | `number` | `100` | The highest value. |
| `step` | `number` | `1` | The value snaps to multiples of `step` from `min`. |
| `onChange` | `function` | | Called with the new number, then the change event. |
| `className` | `string` | | Added to the root, after `volta-native_slider`. |
| `style` | `object` | | Merged with the one custom property the component sets for the filled part of the track. |

Other props (`disabled`, `aria-label`, `name`, `id`, ...) go to the `<input>`.

## Variants and states

- **Default:** a 6px track filled with the accent up to the thumb, and an 18px round thumb.
- **Hover and focus:** a ring around the thumb. The thumb itself never changes size or position.
- **Disabled:** dimmed, a not-allowed cursor, and no hover ring.

## Accessibility

- It is a real `<input type="range">`: Left and Right, Up and Down, Home, End and Page Up and Page Down all work, and a screen reader announces the value.
- It has no visible label; name it with `aria-label` or a `Field` label, and show the value in text beside it when it matters (the styleguide shows "150 ms").
- The filled track is not the only cue: the thumb shows the position too.

## Do and don't

- Do give it a `step` that suits the range, so values are not fractional by accident.
- Do show the current value as text when people need the exact number.
- Don't use it for a range of two values; it has one thumb.
- Don't depend on how the browser draws the track in forced-colours mode; use `Slider` if the look must be exact.
