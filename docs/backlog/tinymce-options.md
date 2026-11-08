---
priority: p2
components: [RichTextTinyMCE]
branch: backlog/tinymce-options
---

# Check RichTextTinyMCE with its new options in a real browser

Done on the branch above (see `docs/features/rich_text_tinymce.md`): `RichTextTinyMCE` now takes `disabled`, `readonly`, `placeholder`, `height`, `tinymceScriptSrc`, `className` (on a wrapper, since the editor ignored it) and an `init` escape hatch for any other TinyMCE option, such as a dark skin. The tests check what the wrapper hands to the editor, using a mock, because TinyMCE loads from a script tag that jsdom never fetches.

## Unverified

Nothing has run against a real TinyMCE. With the dev server (`make dev`), on the RichTextTinyMCE page:

1. **The options do what they say**: the placeholder shows while empty; a height of 200 is 200px tall; a `readonly` editor shows its content and can't be edited; a `disabled` one does too, and both follow the prop when it changes.
2. **Dark mode**: with the page in dark, the default editor is a light box. The "Dark skin" example (`init={{ skin: 'oxide-dark', content_css: 'dark' }}`) should look right on a dark page. Decide whether the wrapper should choose the skin by itself from `Theme.getColorScheme()` (it can't change after the editor starts), or leave it to the app as now.
3. **Another theme**: `Theme.applyTheme('midnight')` from the Theme dropdown. TinyMCE draws its own UI and won't follow it; confirm that is acceptable.
4. The script URL: serve the page from a sub-path and confirm `tinymceScriptSrc` fixes the 404.

If anything is off, record a new task; otherwise delete this file.
