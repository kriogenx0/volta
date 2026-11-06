# ColorPalettePicker

A text box for a colour, with a swatch that opens a palette of 20 preset colours.

## When to use

- **Choosing a colour from a fixed set**, where typing a value is also allowed (a label colour, a tag colour).
- For a native colour chooser, a hex field and swatches in one block, use [`ColorPicker`](../ColorPicker/README.md), which also checks that what is typed is a valid colour and always reports `#RRGGBB`.
- A choice between a few named options is a `RadioGroup` or `SegmentedControl`, not colours.

## Usage

```jsx
import { ColorPalettePicker } from 'volta';

<ColorPalettePicker value={color} onChange={setColor} />;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | `null` | The current colour, as any CSS colour string. The text box follows it whenever it changes. With `null` the picker starts empty and keeps what is typed. |
| `onChange` | `function` | no-op | Called with the colour string when a swatch is chosen and on every keystroke in the text box. |

`ColorPalettePicker.colors` is the list of the 20 preset hex colours.

## Behaviour

- The text box takes any text and passes it to `onChange` as typed, valid or not. Nothing checks that it is a colour.
- The swatch at the right of the box shows the text as a background colour (`value`), and toggles the palette.
- The palette opens when the text box gets focus and closes after you tab or click away (after about 200ms, so a click on a swatch still lands), on Escape, or when you choose a swatch.

## Accessibility

- The text box is named "Color". The swatch button is named "Toggle color palette" and has `aria-expanded`.
- The palette is a `role="group"` named "Color palette". Each swatch is a button named "Select #ff0000" with `aria-pressed` when it matches the current value, and a `title` of the hex value.
- Everything is reachable by Tab, and Enter or Space chooses a swatch.
- The swatch that matches the current value gets a ring and `aria-pressed`. Swatches are 25px square, which is small for touch.

## Do and don't

- Do keep the colour in state and pass it back as `value`.
- Do validate or normalise the string before saving it; free text reaches `onChange`.
- Don't use it for a choice that must be one of the presets only; the text box accepts anything.
- Don't edit `ColorPalettePicker.colors` to change the palette for one screen; use `ColorPicker`'s `palette` prop instead.
