# ColorPicker

A colour field in one block (the picker, the palette, or both): the browser's colour chooser, a hex text box and a grid of swatches, or with `popover` a text box whose swatch button opens the palette. `ColorPalettePicker` is another name for the popover form.

## When to use

- **Choosing any colour** and getting back a clean `#RRGGBB` string (a theme accent, a label colour).
- Add `popover` where there is no room for the swatches to show all the time: a small field in a form or a row of settings. The palette then opens under the text box.
- Pick from a few named options with a `RadioGroup` or `SegmentedControl`, not colours.

## Usage

```jsx
import { ColorPicker } from 'volta';

<>
  <ColorPicker name="accent" value={accent} onChange={setAccent} />
  <ColorPicker initialValue="#4A90E2" palette={['#F06060', '#60AAF0', '#60F06E']} onChange={save} />
  <ColorPicker popover value={accent} onChange={setAccent} />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | | The current colour. When it is given the picker is controlled and follows it. |
| `initialValue` | `string` | `'#FFFFFF'` | The starting colour when `value` is not given. |
| `onChange` | `function` | | Called with the new colour as uppercase `#RRGGBB`. |
| `palette` | `array` of `string` | 12 preset colours | The swatches, in order. Any CSS colour string. |
| `show` | `'both'` \| `'picker'` \| `'palette'` | `'both'` | What is there. `picker` is the colour chooser and the hex text box; `palette` is the swatches. With only the palette there is no text box to carry the value in a form, so a hidden input with the `name` does. |
| `popover` | `bool` | `false` | Shows a text box with a swatch button instead of the native chooser (ignored with `show="picker"`, which has no palette), and the palette opens under it when the text box gets focus or the button is pressed, rather than always showing. See ColorPalettePicker. |
| `name` | `string` | `'color'` | The `name` of the hex text box, for a native form post. |
| `onValueChange` | `function` | no-op | Legacy: called with the same value as `onChange`. |
| `updateColor` | `function` | | Legacy: called with the same value as `onChange`. |

Other props (`placeholder`, `disabled`, `className`, `aria-label`, ...) go to the hex text box. An unreadable `value` or `initialValue` is shown as `#FFFFFF`, and `value={null}` counts as not given. New code uses `onChange`.

## Behaviour

- Choosing a colour in the native chooser or a swatch reports it and updates the text box.
- Typing in the text box reports a colour as soon as the text is a valid one (`#fff`, `#112233`, `red`) but leaves the text as typed. When the box loses focus, valid text is shown as full hex and invalid text goes back to the current colour.
- It is 240px wide.
- With `popover` the palette opens when the text box or a swatch gets focus, and closes about 200ms after focus leaves the picker (so a click on a swatch still lands), on Escape, or when a swatch is chosen. The button shows the current colour.

## ColorPalettePicker

`ColorPalettePicker` is `<ColorPicker popover />` with a palette of 20 presets (`ColorPalettePicker.colors`) and its text box named "Color", kept for existing code. It takes the same props. Unlike before, it checks what is typed: only a valid colour reaches `onChange`, reported as `#RRGGBB`, and an invalid entry goes back to the current colour when the box loses focus. Without a `value` it starts at `#FFFFFF`, where it used to start empty.

## Accessibility

- The native chooser is named "Choose color". The text box is named "Hex color" unless you pass `aria-label`. With `popover` there is no native chooser, and the button is named "Toggle color palette" with `aria-expanded`.
- The swatches are a `role="group"` named "Color palette". Each is a button named "Select #F06060" with `aria-pressed` when it is the current colour.
- Everything is reachable with Tab, and Enter or Space chooses a swatch. The browser's own colour dialog is as accessible as the browser makes it.
- The current swatch gets a ring as well as the pressed state. Swatches are 30px round, a little under a comfortable touch size.

## Do and don't

- Do keep `onChange` as the one callback and the colour in your state.
- Do pass a `palette` of colours from your own brand or data, not a bright random set.
- Don't validate the text box yourself; only valid colours reach `onChange`.
- Don't read the colour from the DOM; use `onChange`.
- Don't use `onValueChange` or `updateColor` in new code.
