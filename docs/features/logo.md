# Logo

The Volta mark is a **V whose right arm steps like a lightning bolt**: a bold white letter on a rounded accent-blue badge, so it reads as the V first and as a charge second. (It replaced two earlier marks: a V with a spark in its arm, then a voltaic pile of discs. Both are in the git history.)

## Files

| File | What it is |
| --- | --- |
| `styleguide/public/logo.svg` | The full logo: the badge in the stock accent (`#4a90e2`) with a white V. Used as the page icon (`<link rel="icon">` in `styleguide/index.html`) and anywhere an image file is needed. |
| `styleguide/public/logo-mono.svg` | The V alone, in `currentColor`: put it in text or on any colour (inline it, or use it in a mask). |
| `styleguide/views/Logo.jsx` and `Logo.scss` | The mark as a component for the styleguide header (`Logo`, `size` defaults to 34). The badge is `var(--v-accent)` and the V `var(--v-on-accent)`, so it follows the theme, a custom accent and light or dark. |
| `styleguide/views/logoShapes.js` | The points of the V (`LOGO_POINTS`), shared by the component and checked against both SVG files. |

The files in `public/` are copied to the root of the styleguide build, so they are served at `/logo.svg` and `/logo-mono.svg`. As an `<img>` the full logo is always the stock blue; to follow a theme, use the component.

## Geometry

A 64 x 64 box and a rounded square with `rx` 16. One polygon, `9,10 22,10 32,34 42,10 55,10 44,28 51,28 32,54`: two arms 13 wide at the top (y = 10) meeting in a point at the bottom centre (32, 54), where the right arm steps out by 7 at y = 28 like the middle of a bolt. Every corner is at least 8 from the edge of the box.

## Tests

`tests/logo.test.jsx`: both files parse as SVG named "Volta" with a 64 box, draw the same polygon as the component, the mono file has no badge and uses `currentColor`, the shape points down to the bottom centre with four corners along the top, every corner stays inside the box with room to spare, `index.html` links the icon, and the component draws the V in a hidden badge at the size asked for.

## Known limits

- **Drawn and judged in a rendered preview only.** The mark was checked as a raster of the same shape at 200, 48, 32 and 16px; it was not opened in a browser or on a real tab strip, so how it looks as a favicon, in dark mode browser chrome or on retina screens is unchecked.
- At 16px the step in the arm is a single notch; it still reads as a V, and the bolt is only clear from about 32px up.
- There is no wordmark: the name beside the mark in the header is ordinary text. There are no PNG, ICO or Apple touch icon files, so older browsers and iOS home screens use their default icon.
- The badge corner is fixed in the SVG (`rx` 16); it does not follow the Square, Rounded and Pill shapes.
- A logo guideline (clear space, minimum size, colours on other backgrounds) is not written.

## History

- 2026-11-10 (local, not merged or deployed): added the mark (a V with a spark in its arm), then replaced it with the voltaic pile.
- 2026-11-10 (local, not merged or deployed): replaced the pile with the V whose arm steps like a bolt.
