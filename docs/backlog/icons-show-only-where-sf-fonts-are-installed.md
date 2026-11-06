---
priority: p2
components: [Icon, CloseButton, Dropdown, ActionMenu, Tag, FilePicker, FileManager, ImageCrop, VideoPlayer, IndicatorDot, ClipboardHover]
---

# Icons show only where the SF fonts are installed

## Objective

`Icon` draws a glyph from one of two icon fonts, and the library ships neither: there is no `@font-face` for "Volta Icons" and no font file in the repository, and the SF Symbols entries use `font-family: SF_Symbol, "SF Pro"`, which exists only on Apple systems with those fonts. (The glyph table is marked "copied from @marcom/ac-sasskit", so whether it may be redistributed is also a question.) All 11 icon types the components use are SF Symbols, so on Windows, Linux, Android, and any Mac without the fonts, the close button, the dropdown chevron, the action menu's ellipsis, the tag and file-picker removers, the image crop controls, the video-off icon, the indicator dot and the clipboard icon draw nothing.

Used today: `multiply` (CloseButton), `chevron.down` (Dropdown), `ellipsis` (ActionMenu), `xmark` (Tag, FilePicker), `chevron.backward.circle.fill` (FileManager), `image`, `rectangle.expand.vertical`, `rectangle.compress.vertical` (ImageCrop), `video.slash` (VideoPlayer), `circle.fill` (IndicatorDot), `list.clipboard` (ClipboardHover).

`Icon` can now draw inline SVG (`components/Icon/svgIcons.js`), which needs no font; six icons are drawn that way (see `docs/features/icons.md`).

## Requirements

Decide, then do one:

- **Draw them** (recommended): add SVG versions of the 11 glyphs above to `svgIcons.js`, and have the components keep their type names. `Icon` prefers an SVG when it has one, so nothing else changes. The catch is design: on a Mac with the SF fonts the system glyphs are replaced by the drawn ones, which are not identical. Either accept that, or prefer the SF glyph when it is available (detect with `document.fonts.check`) and fall back to the SVG.
- **Or ship the fonts** with an `@font-face`, which needs the files and a licence that allows it.

Either way, fix the `Icon` styleguide page: its grid lists names that are in no table (`bell`, `heart`, `star`, `person`, `folder`, ...) and so render nothing and log a warning, and `size="large"` isn't a size.

## Acceptance criteria

- Every `<Icon type="...">` in `components/` has an SVG, or a font that is loaded; a test lists the types components use and fails for one with neither.
- The `Icon` examples show only icons that exist.
- Checked in a browser on a machine without SF Pro installed (or with the OS font disabled).
