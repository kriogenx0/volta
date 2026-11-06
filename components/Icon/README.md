# Icon

A single glyph from the library's icon fonts, picked by name, that takes the colour and size of the text around it.

## When to use

- **A symbol next to text** (a chevron on a menu button, a check beside a status), or inside another component such as a `Button`.
- An icon that is the only content of a button is an [`IconButton`](../IconButton/README.md), or a `Button` with an `aria-label`. A close "x" is [`CloseButton`](../CloseButton/README.md). A coloured status mark is [`Badge`](../Badge/README.md) or [`IndicatorDot`](../IndicatorDot/README.md).

## Usage

```jsx
import { Icon } from 'volta';

<>
  <Icon type="chevron.down" aria-hidden="true" />
  <Icon type="checkmark" size="small" aria-hidden="true" />
  <Icon type="trash" role="img" aria-label="Delete" />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `type` | `string` | | Required. The icon name: a key of the legacy font map (`chevrondown`, `close`, `check`, `plus`, ...) or an SF-Symbols style name (`chevron.down`, `xmark`, `trash`, ...). Both lists are in `icons.js`. |
| `size` | `'small'` | | `Icon.sizes` lists the options. `'small'` is 80% of the surrounding text size; without it the glyph is the text size. |
| `className` | `string` | | Added to the `<i>`. |

Any other prop (`aria-hidden`, `role`, `aria-label`, `title`, `data-*`) goes to the `<i>`. The legacy font map is checked first, so a name in both lists (`plus`, `clock`) uses the legacy glyph. An unknown name logs "Icon type not recognized" and renders an empty `<i>`.

## Theming

The glyph is drawn with the text colour of its parent, so it follows the theme: set the colour on the parent, not on the icon. Legacy names use the `Volta Icons` font; SF-Symbols style names use the `SF_Symbol` and `SF Pro` fonts. The library names these fonts but does not load them (it has no `@font-face` for them), so the host page has to supply them or the glyphs do not show.

## Accessibility

- It renders an `<i>` with no role and no label. Next to text, pass `aria-hidden="true"` so the glyph is not read out.
- An icon that carries meaning on its own needs a name: `role="img"` with an `aria-label`, or put it inside a control that has one (an icon-only button needs `aria-label`).
- Don't convey state by the icon or its colour alone; pair it with text.

## Do and don't

- Do use the icon's name from `icons.js`; check it exists, because an unknown name shows nothing.
- Do pair an icon with a text label wherever space allows.
- Don't set the colour or size with inline `style`; use the parent's text colour and `size`.
- Don't use an icon as a button by itself; use `IconButton`.
- Don't use an icon whose meaning isn't obvious without a label or a tooltip.
