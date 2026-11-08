# ColorPicker

A colour field in one block: the browser's colour chooser, a hex text box and a grid of swatches.

## When to use

- **Choosing any colour** and getting back a clean `#RRGGBB` string (a theme accent, a label colour).
- For a text box with a drop-down palette of 20 presets that reports whatever text is typed, use [`ColorPalettePicker`](../ColorPalettePicker/README.md).
- Pick from a few named options with a `RadioGroup` or `SegmentedControl`, not colours.

## Usage

```jsx
import { ColorPicker } from 'volta';

<>
  <ColorPicker name="accent" value={accent} onChange={setAccent} />
  <ColorPicker initialValue="#4A90E2" palette={['#F06060', '#60AAF0', '#60F06E']} onChange={save} />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | | The current colour. When it is given the picker is controlled and follows it. |
| `initialValue` | `string` | `'#FFFFFF'` | The starting colour when `value` is not given. |
| `onChange` | `function` | | Called with the new colour as uppercase `#RRGGBB`. |
| `palette` | `array` of `string` | 12 preset colours | The swatches, in order. Any CSS colour string. |
| `name` | `string` | `'color'` | The `name` of the hex text box, for a native form post. |
| `onValueChange` | `function` | no-op | Legacy: called with the same value as `onChange`. |
| `updateColor` | `function` | | Legacy: called with the same value as `onChange`. |

Other props (`placeholder`, `disabled`, `className`, `aria-label`, ...) go to the hex text box. An unreadable `value` or `initialValue` is shown as `#FFFFFF`. New code uses `onChange`.

## Behaviour

- Choosing a colour in the native chooser or a swatch reports it and updates the text box.
- Typing in the text box reports a colour as soon as the text is a valid one (`#fff`, `#112233`, `red`) but leaves the text as typed. When the box loses focus, valid text is shown as full hex and invalid text goes back to the current colour.
- It is 240px wide.

## Accessibility

- The native chooser is named "Choose color". The text box is named "Hex color" unless you pass `aria-label`.
- The swatches are a `role="group"` named "Color palette". Each is a button named "Select #F06060" with `aria-pressed` when it is the current colour.
- Everything is reachable with Tab, and Enter or Space chooses a swatch. The browser's own colour dialog is as accessible as the browser makes it.
- The current swatch gets a ring as well as the pressed state. Swatches are 30px round, a little under a comfortable touch size.

## Do and don't

- Do keep `onChange` as the one callback and the colour in your state.
- Do pass a `palette` of colours from your own brand or data, not a bright random set.
- Don't validate the text box yourself; only valid colours reach `onChange`.
- Don't read the colour from the DOM; use `onChange`.
- Don't use `onValueChange` or `updateColor` in new code.
