# NativeColorPicker

The browser's own colour chooser (`<input type="color">`), styled to match the other fields.

## When to use

- **A plain colour swatch that opens the system chooser**, with nothing else around it.
- For a hex text box, presets, or Volta's own chooser use [`ColorPicker`](../ColorPicker/README.md); it uses this component unless `picker="custom"`.
- The look of the browser's dialog is the browser's own and differs between browsers and systems; when it must look the same everywhere use `ColorPicker picker="custom"`.

## Usage

```jsx
import { NativeColorPicker } from 'volta';

<NativeColorPicker value={color} onChange={setColor} />;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | `'#000000'` | The current colour as `#RRGGBB`. The browser's chooser always has a colour, and takes no other format. |
| `onChange` | `function` | | Called with the chosen colour as `#RRGGBB` (lower case, as the browser gives it). |
| `aria-label` | `string` | `'Choose color'` | The accessible name. |
| `className` | `string` | | Added to the root, after `volta-native_color_picker`. |

Other props (`disabled`, `name`, ...) go to the `<input>`.

## Variants and states

- **Default:** a 46px swatch, as tall as the other fields. Its corners follow the shape (`Theme.setShape`): square has none, rounded the usual 4px, pill rounds the ends right off. The colour inside takes the same corners a fifth tighter (`radius * 0.8`), so it sits inside the box's curve in every shape.
- **Hover and focus:** the shared field border colours, and the accent outline on focus.
- **Disabled:** dimmed, with a not-allowed cursor.

## Accessibility

- It is a real `<input type="color">`, so the browser provides the keyboard and screen reader behaviour of its dialog.
- It has no visible label; name it with `aria-label` or a `Field` label.
- Colour is its whole content, so show the chosen value in text next to it (as `ColorPicker` does) when it matters.

## Do and don't

- Do show the hex value as text beside it so the choice is readable.
- Don't pass a colour name or `rgb()`; only `#RRGGBB` works.
- Don't use it where the dialog must look the same on every device; use the custom picker.
