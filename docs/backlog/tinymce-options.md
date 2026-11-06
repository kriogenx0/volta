---
priority: p2
components: [RichTextTinyMCE]
---

# TinyMCE: pass through the editor options

## Objective

`RichTextTinyMCE` exposes only `value` and `onChange`. `className` on the inner `Editor` is dropped by `@tinymce/tinymce-react`, and there is no way to set `disabled`, `readonly`, `placeholder` or `height`. (`RichTextQuill`'s hard-coded white background is already fixed: it uses `--v-color-base`.)

## Requirements

- Pass `disabled`, `readonly`, `placeholder` and `height` through to TinyMCE (through its `init` options where the wrapper requires it), with PropTypes. Adding props is an API change: call it out in the feature doc.
- `tinymceScriptSrc` is a relative path that only works when the page is served from the site root; make it configurable or document it.
- Check the editor in light and dark mode and under a non-default theme (`Theme.applyTheme('midnight')`), since TinyMCE draws its own UI.

## Acceptance criteria

- Tests assert the options reach the TinyMCE `Editor` props (the existing tests mock `Editor`).
- Examples for read-only, disabled and fixed height.
- Checked in a browser in light and dark mode.
