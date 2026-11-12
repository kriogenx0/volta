# Toggle

An on/off switch for a setting that takes effect immediately, built on a native checkbox.

## When to use

- **A setting that applies as soon as it is flipped:** dark mode, notifications on or off, a feature flag.
- Use [`Checkbox`](../Checkbox/README.md) for an on/off choice that is submitted later with a form, or for agreeing to terms. Use [`RadioGroup`](../RadioGroup/README.md) or [`SegmentedControl`](../SegmentedControl/README.md) to pick one of several.
- The switch has no text of its own. Name the setting with `aria-label`, or with visible text in a `<label htmlFor>` that points at the toggle's `id`.

## Usage

```jsx
import { Toggle } from 'volta';

<Toggle
  aria-label="Email notifications"
  checked={enabled}
  onChange={(event) => setEnabled(event.target.checked)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `checked` | `bool` | | The state, when you control it. Pair it with `onChange`. |
| `onChange` | `function` | no-op | The native change event: read `event.target.checked`. |
| `isDisabled` | `bool` | `false` | Disables the checkbox and dims the switch. Use this, not `disabled`. |
| `showMarks` | `bool` | `false` | Prints an **I** on the on side and an **O** on the off side of the track, as a second cue besides colour. The knob covers the one for the other state, so only the current mark shows. |
| `knobSize` | `'sm'` \| `'md'` | `'sm'` | The round knob. `sm` is smaller than the track is high and sits inset in it by 2px (23px across with its border). `md` is as tall as the track (27px), the knob the toggle had before the smaller default. The track is 45px by 25px either way. `Toggle.knobSizes` lists them. |
| `name` | `string` | | The native `name`, for forms. |
| `value` | `string` | | The native `value`, sent with the form when it is on. |
| `className` | `string` | | Added to the wrapping `<label>`. |

Any other prop goes to the `<input type="checkbox">`: `aria-label`, `id`, `defaultChecked` for an uncontrolled switch, `required`. The `disabled` attribute would reach the input, but only `isDisabled` also dims the switch.

The knob and the off half of the track use the page colour, so the switch is light in light mode and dark in dark mode; the on half is the accent.

## Accessibility

- The I and O marks are decorative (`aria-hidden`): the switch is still just a checkbox named by its label, and its state is announced as checked or not.
- It is a native checkbox inside a `<label>`, so Tab reaches it, Space flips it, and clicking anywhere on the switch toggles it. The checkbox is invisible but stays in the tab order, and the switch shows a focus ring.
- It is announced as a checkbox with a checked state, not a "switch". The on state is shown by the knob's position and the accent fill, not colour alone.
- It needs an accessible name: `aria-label`, or a `<label htmlFor>` pointing at its `id` (the toggle is already inside a `<label>` of its own, so don't wrap it in another). Without a name a screen reader hears only "checkbox".

## Do and don't

- Do use it only when flipping it takes effect right away, and say what it controls in the label ("Email notifications").
- Do reflect failure: if saving the setting fails, put the switch back and show the error.
- Don't use it for a choice that needs a Save button; use a [`Checkbox`](../Checkbox/README.md).
- Don't use two toggles for either-or; use a [`RadioGroup`](../RadioGroup/README.md) or a `SegmentedControl`.
- Don't recolour it; the on colour is `--v-accent` and follows the runtime accent.
