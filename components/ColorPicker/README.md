# ColorPicker

A colour field: by default a text box with a swatch button that opens a palette (and, with `picker="custom"`, the picker) under it; with `popover={false}` the browser's colour chooser, a text box and a grid of swatches laid out in the page. `ColorPalettePicker` is another name for the popover form with 20 presets.

## When to use

- **Choosing any colour** and getting back a clean `#RRGGBB` string (a theme accent, a label colour).
- It is a popover by default, which suits a small field in a form or a row of settings: the palette opens under the text box when it has focus. Pass `popover={false}` where there is room for the swatches to show all the time.
- Pick from a few named options with a `RadioGroup` or `SegmentedControl`, not colours.

## Usage

```jsx
import { ColorPicker } from 'volta';

<>
  <ColorPicker name="accent" value={accent} onChange={setAccent} />
  <ColorPicker initialValue="#4A90E2" palette={['#F06060', '#60AAF0', '#60F06E']} onChange={save} />
  <ColorPicker popover={false} value={accent} onChange={setAccent} />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | | The current colour. When it is given the picker is controlled and follows it. |
| `initialValue` | `string` | `'#FFFFFF'` | The starting colour when `value` is not given. |
| `onChange` | `function` | | Called with the new colour in `format`: uppercase `#RRGGBB` by default. |
| `palette` | `array` of `string` | 12 preset colours | The swatches, in order. Any CSS colour string. |
| `show` | `'both'` \| `'picker'` \| `'palette'` | `'both'` | What is there. `picker` is the colour chooser and the hex text box; `palette` is the swatches. With only the palette there is no text box to carry the value in a form, so a hidden input with the `name` does. |
| `picker` | `'native'` \| `'custom'` | `'native'` | The colour chooser. `native` is the browser's own, as [`NativeColorPicker`](../NativeColorPicker/README.md). `custom` is Volta's own: a saturation and brightness square over a hue slider, above the text box (or at the top of the popover with `popover`). Ignored with `show="palette"`, which has no chooser. |
| `format` | `'hex'` \| `'rgb'` \| `'hsl'` | `'hex'` | How the colour is written in the text box and reported by `onChange`: `#RRGGBB`, `rgb(255, 0, 0)` or `hsl(0, 100%, 50%)`. Typing accepts all of them, and colour names, whichever `format` is set. `ColorPicker.formats` lists them. |
| `textbox` | `bool` | `true` | Show the text box. `false` leaves the swatch, the picker or the palette on their own; a hidden input with the `name` then carries the value in a form. |
| `side` | `'left'` \| `'right'` | `'left'` (native chooser), `'right'` (popover button) | Which side of the text box the swatch (the native chooser, or the popover's button) is on. |
| `popover` | `bool` | `true` | A text box with a swatch button at one end, and the palette opens under it when the text box gets focus or the button is pressed. `false` lays the native chooser (or the custom picker), the text box and the palette out in the page, always showing. Ignored with `show="picker"`, which has no palette. See ColorPalettePicker. |
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

## Format, side and the text box

- **`format`:** the colour is kept as one value inside; `format` only decides how it is written, in the text box and in what `onChange` gets. Anything a browser calls a colour can be typed or passed as `value`: `#fff`, `#112233`, `rgb(17, 34, 51)`, `hsl(210, 50%, 13%)`, `navy`. Changing `format` rewrites the box at once. Transparency is not kept: an alpha value is dropped.
- **`side`:** the swatch sits on the left of the text box, except the popover's button, which sits on the right. `side="right"` or `side="left"` puts either one on the other side. The corners where swatch and text box meet are square; the others follow the shape (square, rounded or pill).
- **`textbox={false}`:** no text box. With the native chooser you get just the swatch; with `picker="custom"` the square and hue slider; with `popover` just the swatch button; with the palette the swatches. A swatch on its own is as wide as it is, not 240px.
- **Shape:** every corner (the field, the popover, the picker square, the hue strip) uses the radius tokens, and the round swatches and handles use the pill token, so `Theme.setShape('square')` makes them square and `'pill'` rounds the fields right off.

## The custom picker

With `picker="custom"` the square and the hue strip are drawn on a canvas, one pixel for every colour (`colorCanvas.js`; the square is redrawn when the hue changes). They are real sliders: Tab to each, then the arrow keys move by 1 (10 with Shift), Home and End go to the edges, and a drag with the mouse works too. The hue is remembered when the colour passes through white, black or a grey, which have none. It is the same `onChange`, so the rest of the field behaves as before.

## Accessibility

- The native chooser is named "Choose color"; the custom square is named "Saturation and brightness" and the slider "Hue". The text box is named "Hex color", or "RGB color" or "HSL color" with `format`. The text box is named "Hex color" unless you pass `aria-label`. With `popover` there is no native chooser, and the button is named "Toggle color palette" with `aria-expanded`.
- The swatches are a `role="group"` named "Color palette". Each is a button named "Select #F06060" with `aria-pressed` when it is the current colour.
- Everything is reachable with Tab, and Enter or Space chooses a swatch. The browser's own colour dialog is as accessible as the browser makes it.
- The current swatch gets a ring as well as the pressed state. Swatches are 30px round, a little under a comfortable touch size.

## Do and don't

- Do keep `onChange` as the one callback and the colour in your state.
- Do pass a `palette` of colours from your own brand or data, not a bright random set.
- Don't validate the text box yourself; only valid colours reach `onChange`.
- Don't read the colour from the DOM; use `onChange`.
- Don't use `onValueChange` or `updateColor` in new code.
