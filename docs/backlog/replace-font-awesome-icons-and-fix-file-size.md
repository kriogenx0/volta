---
priority: p2
components: [ImagePicker, Message, FileUploader, FileManager, util]
---

# Icons that render blank, and a broken file-size helper

## Objective

- `ImagePicker`, `Message` and `FileUploader` draw icons with Font Awesome classes (`fa fa-trash`, `fa fa-check-circle`, ...), but Font Awesome isn't a dependency and isn't loaded by the library or the styleguide, so those icons render as nothing. Their labels are fine (they have `aria-label`), but the visuals are missing.
- `util/FileUtil.js`: `FileUtil.size` calls `size(number, { base: 10 })`, but `size` is never imported, so calling it throws a `ReferenceError`. Nothing calls it today.

## Requirements

- Use the library's own `Icon` component (or inline SVG) for those icons, with `aria-hidden` on decorative ones, instead of Font Awesome classes. Add any missing glyphs to `Icon`.
- Fix or delete `FileUtil.size`: import a formatter (check `package.json` for what is already a dependency; don't add one without asking) or format bytes with a small pure function, and unit-test it.

## Acceptance criteria

- No `fa fa-` class remains in `components/`.
- The ImagePicker, Message and FileUploader examples show their icons in light and dark mode (checked in a browser).
- A test covers `FileUtil.size`.
