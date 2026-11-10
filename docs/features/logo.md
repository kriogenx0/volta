# Logo

The Volta mark is a **voltaic pile**: the stack of discs Alessandro Volta built the first battery from. Three white pills narrow from the top to the bottom, so the stack also reads as a **V**, and a small dot below it is the spark. It sits on a rounded accent-blue badge. (It replaced an earlier mark, a V with a spark in its arm.)

## Files

| File | What it is |
| --- | --- |
| `styleguide/public/logo.svg` | The full logo: the badge in the stock accent (`#4a90e2`) with white discs. Used as the page icon (`<link rel="icon">` in `styleguide/index.html`) and anywhere an image file is needed. |
| `styleguide/public/logo-mono.svg` | The discs alone, in `currentColor`: put it in text or on any colour (inline it, or use it in a mask). |
| `styleguide/views/Logo.jsx` and `Logo.scss` | The mark as a component for the styleguide header (`Logo`, `size` defaults to 34). The badge is `var(--v-accent)` and the discs `var(--v-on-accent)`, so it follows the theme, a custom accent and light or dark. |
| `styleguide/views/logoShapes.js` | The three discs and the dot, shared by the component and checked against both SVG files. |

The files in `public/` are copied to the root of the styleguide build, so they are served at `/logo.svg` and `/logo-mono.svg`. As an `<img>` the full logo is always the stock blue; to follow a theme, use the component.

## Geometry

A 64 x 64 box and a rounded square with `rx` 16. Three pills, each 9 tall with a corner radius of 4.5, centred on x = 32: 42 wide at y = 11, 30 wide at y = 23, and 18 wide at y = 35 (a 3-unit gap between them). Below them a dot of radius 3.5 at (32, 51).

## Tests

`tests/logo.test.jsx`: both files parse as SVG named "Volta" with a 64 box, draw the same discs and dot as the component, the mono file has no badge and uses `currentColor`, the discs narrow from top to bottom and are centred, every shape stays inside the box with a gap between discs, `index.html` links the icon, and the component draws the pile in a hidden badge at the size asked for.

## Known limits

- **Drawn and judged in a rendered preview only.** The mark was checked as a raster of the same shapes at 256, 64, 32 and 16px, on light and dark; it was not opened in a browser or on a real tab strip, so how it looks as a favicon, in dark mode browser chrome or on retina screens is unchecked.
- The stack can read as a funnel or filter icon at a glance; the dot below is what makes it a pile with a spark. If that is a problem, the first mark (a V with a spark gap) is in the git history.
- There is no wordmark: the name beside the mark in the header is ordinary text. There are no PNG, ICO or Apple touch icon files, so older browsers and iOS home screens use their default icon.
- The badge corner is fixed in the SVG (`rx` 16); it does not follow the Square, Rounded and Pill shapes.
- A logo guideline (clear space, minimum size, colours on other backgrounds) is not written.

## History

- 2026-11-10 (local, not merged or deployed): added the mark (a V with a spark in its arm), then replaced it with the voltaic pile.
