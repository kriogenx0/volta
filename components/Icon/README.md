# Icon

A single icon, drawn as SVG and picked by name, that takes the colour and size of the text around it.

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
| `type` | `string` | | Required. The icon name: any key of `svgIcons.js` (`chevron.down`, `xmark`, `trash`, `checkmark.circle.fill`, ...; the styleguide shows them all), or one of the older font names in `icons.js` that have no drawing yet. |
| `size` | `'small'` | | `Icon.sizes` lists the options. `'small'` is 80% of the surrounding text size; without it the glyph is the text size. |
| `className` | `string` | | Added to the `<i>`. |

Any other prop (`aria-hidden`, `role`, `aria-label`, `title`, `data-*`) goes to the `<i>`. A name is looked up as an SVG drawing first, then in the legacy font map, then as an SF Symbol. An unknown name logs "Icon type not recognized" and renders an empty `<i>`.

## The drawings

About 60 icons are drawn on a 24 x 24 grid with a 1.75 stroke and round ends (`components/Icon/svgIcons.js`): arrows and chevrons, `xmark`, `plus`, `minus`, `checkmark`, circles and status marks, a document, folder, gear, bell, person, envelope, phone, star, heart, bookmark, flag, globe, clock, image, clipboard, camera, trash, pencil, search and more. Names follow SF Symbols, and the older names for the same thing (`close`, `multiply`, `times`, `x` for `xmark`; `check`; `search`; `mail`) draw the same icon.

A **filled** icon (`circle.fill`, `checkmark.circle.fill`, `star.fill`, `folder.fill`, ...) is a solid shape in the text colour with its glyph cut out in the page colour (`--v-icon-knockout`, which is `--v-color-base` unless you set it). `spinner` is an open ring that turns, and holds still for reduced motion.

Names with no drawing yet (brand logos such as `facebook`, devices such as `applewatch`) still use the fonts below.

## Theming

The icon is drawn with the text colour of its parent, so it follows the theme: set the colour on the parent, not on the icon. A drawn icon needs no font. The few names with no drawing use the `Volta Icons` font (legacy names) or the `SF_Symbol` and `SF Pro` fonts (SF-Symbols characters); the library names these fonts but does not load them (it has no `@font-face` for them), so the host page has to supply them or those glyphs do not show.

## Accessibility

- It renders an `<i>` with no role and no label. Next to text, pass `aria-hidden="true"` so the glyph is not read out.
- An icon that carries meaning on its own needs a name: `role="img"` with an `aria-label`, or put it inside a control that has one (an icon-only button needs `aria-label`).
- Don't convey state by the icon or its colour alone; pair it with text.

## Do and don't

- Do use a name from the styleguide's grid; an unknown name shows nothing.
- Do pair an icon with a text label wherever space allows.
- Don't set the colour or size with inline `style`; use the parent's text colour and `size`.
- Don't use an icon as a button by itself; use `IconButton`.
- Don't use an icon whose meaning isn't obvious without a label or a tooltip.
