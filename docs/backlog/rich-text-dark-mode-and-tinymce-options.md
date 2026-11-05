---
priority: p2
components: [RichTextQuill, RichTextTinyMCE]
---

# Rich text editors: dark mode and TinyMCE options

## Objective

- `components/RichTextQuill/RichTextQuill.scss` sets `background: #fff`, which stays white in dark mode and breaks the theme rules (tokens only).
- `RichTextTinyMCE` exposes only `value` and `onChange`. `className` on the inner `Editor` is dropped by `@tinymce/tinymce-react`, and there is no way to set `disabled`, `readonly`, `placeholder` or `height`.

## Requirements

- Replace the hard-coded colours in `RichTextQuill.scss` with `--v-*` tokens, including the toolbar and the editing area.
- Pass `disabled`, `readonly`, `placeholder` and `height` through to TinyMCE (through its `init` options where the wrapper requires it), with PropTypes. Adding props is an API change: call it out in the feature doc.
- `tinymceScriptSrc` is a relative path that only works when the page is served from the site root; make it configurable or document it.

## Acceptance criteria

- Quill and TinyMCE look right in light and dark mode (checked in a browser).
- Tests assert the options reach the TinyMCE `Editor` props (the existing tests mock `Editor`).
- Examples for read-only, disabled and fixed height.
