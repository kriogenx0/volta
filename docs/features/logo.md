# Logo

The Volta mark: a **V whose right arm is broken by a spark**, white on a rounded accent-blue badge. Volta is named for the unit of electric potential; the break in the arm is the spark, and the V is the letter. The strokes are round-capped and thick (8 in a 64 box), so the mark still reads as a V at 16px.

## Files

| File | What it is |
| --- | --- |
| `styleguide/public/logo.svg` | The full logo: the badge in the stock accent (`#4a90e2`) with white strokes. Used as the page icon (`<link rel="icon">` in `styleguide/index.html`) and anywhere an image file is needed. |
| `styleguide/public/logo-mono.svg` | The strokes alone, in `currentColor`: put it in text or on any colour (inline it, or use it in a mask). |
| `styleguide/views/Logo.jsx` and `Logo.scss` | The mark as a component for the styleguide header (`Logo`, `size` defaults to 34). The badge is `var(--v-accent)` and the strokes `var(--v-on-accent)`, so it follows the theme, a custom accent and light or dark. |
| `styleguide/views/logoPaths.js` | The three stroke paths and the stroke width, shared by the component and checked against both SVG files. |

The files in `public/` are copied to the root of the styleguide build, so they are served at `/logo.svg` and `/logo-mono.svg`. As an `<img>` the full logo is always the stock blue; to follow a theme, use the component.

## Geometry

A 64 x 64 box, a rounded square with `rx` 16, and three strokes of width 8 with round caps and joins: the left arm `M17 17 L31 47`, the upper part of the right arm `M48.5 16.5 L44 25.5`, and its lower part `M42.5 35.5 L31 47`. The gap between the two right-arm pieces is about 3 units, enough to stay open at 32px.

## Tests

`tests/logo.test.jsx`: both files parse as SVG named "Volta" with a 64 box, draw the same strokes as the component, the mono file has no badge and uses `currentColor`, every stroke stays inside the box with room for its width, `index.html` links the icon, and the component draws the strokes in a hidden badge at the size asked for.

## Known limits

- **Drawn and judged in a rendered preview only.** The mark was checked as a raster of the same strokes at 256, 64, 32 and 16px, on light and dark; it was not opened in a browser or on a real tab strip, so how it looks as a favicon, in dark mode browser chrome or on retina screens is unchecked.
- There is no wordmark: the name beside the mark in the header is ordinary text. There are no PNG, ICO or Apple touch icon files, so older browsers and iOS home screens use their default icon.
- The badge corner is fixed in the SVG (`rx` 16); it does not follow the Square, Rounded and Pill shapes.
- A logo guideline (clear space, minimum size, colours on other backgrounds) is not written.

## History

- 2026-11-10 (local, not merged or deployed): added the mark, the two files, the component, the page icon, and the header uses it in place of the letter V.
