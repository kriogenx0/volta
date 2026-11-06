# Rich text: TinyMCE

`RichTextTinyMCE` wraps the TinyMCE editor (`@tinymce/tinymce-react`) with a small set of tools: undo and redo, bold, italic, alignment, an HTML source button, and the link and image plugins. TinyMCE is self-hosted under the GPL (no tiny.cloud API key): the build copies `node_modules/tinymce` to `tinymce/`, and the editor loads from there as a script, so it appears once that script has loaded.

## Props

| Prop | |
| --- | --- |
| `value`, `onChange` | the content as HTML; `onChange(html, editor)` |
| `disabled` | turns editing off (TinyMCE shows it read-only); follows the prop as it changes |
| `readonly` | shows the content but doesn't let it be edited; follows the prop as it changes |
| `placeholder` | grey text shown while the editor is empty |
| `height` | a number of pixels, or a CSS length (`'40vh'`) |
| `tinymceScriptSrc` | where TinyMCE's script is served from (default `tinymce/tinymce.min.js`) |
| `className` | added to the wrapper `<div class="volta-rich_text_tinymce">` around the editor |
| `init` | any other TinyMCE option; overrides the defaults (plugins, toolbar), and loses to `placeholder` and `height` |

`disabled` and `readonly` are props of the editor itself. `placeholder` and `height` are TinyMCE init options, so the wrapper puts them in `init`. `className` used to be handed to the editor, which ignores it, so it now goes on a wrapper element.

### The script URL

`tinymce/tinymce.min.js` is relative to the page, so it works when the page is served from the site root, as the styleguide is. From another path, or when the copy lives elsewhere (a CDN, a different folder), pass `tinymceScriptSrc`.

### Dark mode

TinyMCE draws its own interface, which does not follow Volta's tokens or the light/dark scheme. For a dark page use TinyMCE's dark skin through `init`: `init={{ skin: 'oxide-dark', content_css: 'dark' }}`. TinyMCE reads the skin when it starts, so changing it afterwards means remounting the editor.

## Tests

`tests/RichTextTinyMCE/RichTextTinyMCE.test.jsx` mocks the `Editor` (TinyMCE loads from a script tag, which jsdom never fetches) and checks what the wrapper hands it: `disabled` and `readonly` as props, `placeholder` and `height` in `init`, `tinymceScriptSrc`, `init` merging with the right precedence, the wrapper `className`, and that nothing is passed that the editor would ignore.

## Known limits

- Nothing here has run against a real TinyMCE: the editor's behaviour with these options (read-only look, the placeholder, the height) comes from TinyMCE and the React wrapper, and is untested in a browser.
- The interface is not themed to Volta's tokens, and the skin cannot change after the editor starts.

## History

- 2026-11-05 (branch `backlog/tinymce-options`, not merged or deployed): the options above added. Before, the component took only `value` and `onChange`. These are new props (an API addition; nothing existing changes except that the `className` it used to hand the editor is now on a wrapper `<div>`, which adds one element around the editor).
- Not verified in a browser, in light or dark, or under a non-default theme.
