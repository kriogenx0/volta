# Icons

`Icon` draws a small symbol by name: `<Icon type="trash" />`. It draws it one of three ways, found by `type`, and which way matters, because only one of them works everywhere.

## How an icon is drawn

| Way | Types | Shows | Source |
| --- | --- | --- | --- |
| Inline SVG | `trash`, `spinner`, `cloud-upload`, `check-circle`, `times-circle`, `arrow-up-circle` | everywhere, with no font | `components/Icon/svgIcons.js` |
| The "Volta Icons" font | 72 names (`check`, `plus`, `close`, ...) | only where that font is loaded; the library does not load it | `components/Icon/icons.js` |
| SF Symbols | 88 names (`multiply`, `chevron.down`, `ellipsis`, ...) | only on Apple systems with the SF fonts | `unicodeIcons` in `icons.js` |

A drawn icon is an `<i class="volta-icon icon icon-svg icon-<type>">` holding an `<svg>`: 1em square, stroked in `currentColor` (so it takes the text colour and size), round ends, hidden from assistive technology. Pass `aria-hidden="true"` on the `<i>` for a decorative one, as the components do. `size="small"` makes it 80%. The `spinner` turns, and holds still under `prefers-reduced-motion`.

An unknown `type` renders an empty `<i>` and logs a warning.

## Adding a drawn icon

Add a list of path `d` strings to `svgIcons.js` on a 24 x 24 grid, drawn as strokes (no fills), and it works at once: `Icon` prefers an SVG whenever it has one for the type. `tests/Icon/Icon.test.jsx` checks every entry (viewBox, stroke, valid path data, not exposed to assistive technology).

## Where the drawn icons are used

- `ImagePicker`: `cloud-upload` as the placeholder, `spinner` while a file is read, `trash` on the remove button.
- `Message`: `check-circle` (success) and `times-circle` (error). `Message.typeDetails[type].icon` is the icon type.
- `FileUploader`: `arrow-up-circle` to start an upload, `times-circle` to cancel one.

These three used Font Awesome classes (`fa fa-trash` and the like) that the host app had to load; with nothing to load them they showed nothing. They no longer depend on it, and a host that does load Font Awesome loses nothing. `tests/noFontAwesome.test.js` fails if a component goes back to `fa-` classes.

## File sizes

`FileUtil.size(bytes)` (`util/FileUtil.js`) writes a byte count in decimal units: `999 -> "999 B"`, `1500 -> "1.5 kB"`, `1234567 -> "1.23 MB"`, at most two decimals, `""` for anything that is not a number. It used to call an undefined `size` and throw; nothing called it. It does not use a library.

## Tests

`tests/Icon/Icon.test.jsx`, `tests/ImagePicker/ImagePickerIcons.test.jsx`, `tests/FileUploader/FileUploaderIcons.test.jsx`, `tests/Message/Message.test.jsx`, `tests/noFontAwesome.test.js`, `tests/util/FileUtil.test.js`.

## Known limits

- **Every other icon in the library needs a font the library does not ship.** All 11 types that components use (the close button's `multiply`, the dropdown's `chevron.down`, the action menu's `ellipsis`, and so on) are SF Symbols, so they draw nothing off Apple systems. Tracked in `docs/backlog/icons-show-only-where-sf-fonts-are-installed.md`.
- The `Icon` styleguide grid of font icons is mostly blank for the same reason, and lists some names that are in no table.
- The drawn icons are outlines; the Font Awesome ones they replace were solid, so `Message`'s and `ImagePicker`'s icons look lighter than before.

## History

- 2026-11-05 (branch `backlog/replace-font-awesome-icons-and-fix-file-size`, not merged or deployed): inline SVG icons added to `Icon`; `ImagePicker`, `Message` and `FileUploader` moved off Font Awesome; `FileUtil.size` fixed.
- Checked: the six glyphs were drawn on a sheet and looked at (rendered with `sips`), and read as trash, ring, cloud with arrow, check in a circle, cross in a circle, and arrow in a circle.
- Not verified: the icons in place inside `ImagePicker`, `Message` and `FileUploader` in a browser, light and dark, at desktop and mobile widths.
