---
priority: p3
branch: backlog/publish-design-system-bundle
---

# Add bundle and live previews to the artifact

Build the library and add `bundle.js`, `bundle.css` and live previews to the design-system artifact.

## Done on the branch

`make bundle` builds `components/compiled/bundle/bundle.js` and `bundle.css`, and loads in jsdom with the host globals provided (see [docs/features/bundle.md](../features/bundle.md)).

## Blocked

Adding the two files to the design-system artifact and wiring live previews into its pages needs the artifact's account and network access (https://claude.ai/artifact/NvqB2qq26do7JhME6sBdDY), which this environment does not have. What is left:

1. Run `make bundle` and upload `components/compiled/bundle/bundle.js` and `bundle.css` to the artifact.
2. In the artifact page, define `window.React`, `window.ReactDOM` (react-dom plus react-dom/client) and `window.ReactRouterDOM` from React 19 before loading `bundle.js` (React 19 has no UMD builds; snippet in the feature doc), and load `bundle.css` with a `<link>`.
3. Replace the static component screenshots with live `window.volta.<Component>` previews, using `Theme.applyTheme` so the previews follow the artifact's theme.

## Unverified

The bundle was only loaded in jsdom. In a browser, check that `bundle.css` styles a page, that `window.volta.Button` renders, and that a toast and `RichTextTinyMCE` (which loads `tinymce/tinymce.min.js` relative to the page) work.
