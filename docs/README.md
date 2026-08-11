# Volta

A React 19 component library — 92 components covering forms, layout,
feedback, navigation, media, and rich text editing, plus a runtime theming
API and a styleguide. Built with Vite. No CoffeeScript remains anywhere in
the codebase.

## Install

Volta isn't published to a registry. Point at it directly:

```json
{
  "dependencies": {
    "volta": "file:../path/to/volta"
  }
}
```

or link it for local development:

```sh
cd volta && npm link
cd ../your-app && npm link volta
```

## Import

`npm run build` produces a self-contained UMD bundle at
`components/compiled/components.js` (this is the package's `main`). It
bundles every component and injects its own CSS on import, works from
`require()`, `import`, or a `<script>` tag, and only expects `react`,
`react-dom`, and `react-router-dom` to be provided by the host app
(they're marked as externals, so they aren't duplicated in the bundle).

```js
import { Button, Checkbox, Theme } from 'volta';

<Button variant="primary" onClick={...}>Save</Button>
```

```html
<script src="node_modules/react/umd/react.production.min.js"></script>
<script src="node_modules/react-dom/umd/react-dom.production.min.js"></script>
<script src="node_modules/volta/components/compiled/components.js"></script>
<script>
  const { Button } = volta;
</script>
```

Run `npm run build` (or `make build`) after cloning/updating — the compiled
bundle isn't committed.

`RichTextTinyMCE` self-hosts TinyMCE (no tiny.cloud API key needed): the
build copies `node_modules/tinymce` to `components/compiled/tinymce/` and
the component points `tinymceScriptSrc` at it. If you consume the library
via `npm link`/`file:` rather than the built bundle, copy that directory
into your own app's public assets and adjust `tinymceScriptSrc`
accordingly.

## Theming

Every component that uses the shared design tokens (`$color_active`,
`$color_base`, etc. in `styles/_colors.scss`) is themeable at runtime, no
rebuild required, via `components/theme.js`:

```js
import { Theme } from 'volta';

// Recolor every themed component
Theme.setAccentColor('#e0405c');
Theme.resetAccentColor(); // back to the default blue

// 'light' | 'dark' | 'system' (follows the OS by default)
Theme.setColorScheme('dark');
Theme.getColorScheme();

// Global transition/animation duration (default 150ms). Accepts a number
// of milliseconds or a CSS duration string.
Theme.setAnimationSpeed(300);
Theme.setAnimationSpeed('0.3s');
Theme.resetAnimationSpeed();
```

Under the hood this sets CSS custom properties (`--v-accent`,
`--v-anim-speed`, etc.) on `<html>` and toggles `[data-theme]`; see
`styles/_colors.scss` for the full token list.

**Coverage note:** the ~15 components that originate from Volta's newer set (Button,
Checkbox, Dropdown, Select, Tabs, Toggle, Tag, ProgressBar, ActionMenu,
FileManager, DropdownList, TextField, Radio) and anything built on top of
them fully track the accent color and light/dark mode. Most of Volta's
original components still use hardcoded colors and won't react to
`setAccentColor`/`setColorScheme` yet — migrating them onto the shared
tokens is the natural next step for full theme coverage.

## Development

```sh
make            # install, build components, serve the styleguide (default)
make build      # just the component library bundle
make build-app  # just the styleguide app
make test       # run the test suite
make lint       # eslint components/
```

Or directly:

```sh
npm run dev       # Vite dev server for the styleguide, with HMR
npm run build     # component library bundle (Vite library mode)
npm run build-app # styleguide production build
```

The styleguide (`styleguide/`) renders every exported component: curated,
hand-written examples where they exist, and a default-props render for
everything else, plus a live accent color / light-dark / speed switcher
(`styleguide/ThemeSwitcher.jsx`).

### Docker

Build and run the styleguide development app from the repository root:

```sh
docker build -f styleguide/Dockerfile -t volta-styleguide .
docker run --rm -p 8888:8888 volta-styleguide
```

Then open <http://localhost:8888>. The container runs `make run`; it does not
build or publish the component-library bundle.

## Build tooling

Vite (`vite.config.mjs` for the library, `vite.styleguide.config.mjs` for
the styleguide) replaced webpack in 2026-08. A few things worth knowing if
you're touching the build:

- Vite/esbuild only auto-detect JSX in `.jsx`/`.tsx` files, not `.js` — any
  file with JSX needs a `.jsx` extension. A couple of legacy files
  (`TextBox`, `DateInput`, `DateTime/Readonly`) were renamed for this.
- `util/formats` and `util/messages` had Flow type annotations
  (`// @flow`) that Vite's Rolldown-based transform can't parse (unlike
  the old Babel-based webpack pipeline, it doesn't route plain `.js`
  through Babel). The annotations were stripped since nothing here ever
  ran a real Flow typecheck.
- The two `.mjs` extensions on the config files are load-bearing: without
  `"type": "module"` in `package.json`, Vite's config loader treats `.js`
  as CommonJS and can't `require()` the ESM-only Vite ecosystem plugins.

## Testing

`npm test` runs Jest + React Testing Library against `components/**/*.test.jsx`.
Coverage is intentionally focused on components touched during the recent
modernization pass (`Button`, `Card`, `Select`, `Tooltip`, `PopOver`,
`ContentEditable`, `Theme`) rather than all 92 — most of the others have no
tests yet.

## CoffeeScript

The codebase originally shipped 27 `.cjsx` (CoffeeScript+JSX) files with no
build step for that extension — they were dead source, never compiled.
All were converted to plain JSX and wired into `components/index.js` where
they're genuinely self-contained: `AutoComplete`, `List`/`ListHeader`/
`FilterSectionListItem`, `ErrorList` (from `Message`), `BaseForm`/
`BaseInput`/`FormRow` (from `Form`), `Alert` (from `ModalAlert`), and
`DateFormat` (from `DatePicker`).

A few were faithfully translated but **not** wired into `index.js`,
because they depend on packages or a Backbone-style data layer that don't
exist in this repo (same treatment as the already-excluded
`ImageCropPicker`) — each file's header comment explains exactly what's
missing:

- `DatePicker/DateTimeInput.jsx` / `DateTimeRange.jsx` — need `jquery` +
  the xdsoft jQuery datetimepicker plugin, and `formsy-react`. Use
  the maintained `DateInput` or `DatePicker/DatePicker.jsx` instead.
- `Search/SearchStore.jsx` and `ListTable/ListTable.jsx` /
  `ListTableRow.jsx` — expect Backbone-style collections/models
  (`.get()`, `.models`, `.at()`, change listeners); `ListTable` also needs
  `jquery-ui`'s sortable plugin for drag-to-reorder.
- `Map/UserMap.jsx` — needs `leaflet` + `leaflet-draw` and Backbone-style
  models; unrelated to `Map/Map.jsx` (a Google Maps address-search
  component, which is wired in and maintained).
- `AutoComplete.jsx`'s original `store` mode (searching a live Backbone
  collection) and rich `person`/`color` row rendering (via `Pill`/
  `Avatar`/`Track` child components) were dropped rather than ported with
  fabricated stand-ins — only the plain-array mode is implemented.

## Known gaps

- **Redactor** was removed. Its vendored editor (`redactor-lib.js`, a 2015
  jQuery plugin) requires a global `jQuery` and can't be made to work
  without jQuery, which conflicts with removing jQuery as a dependency.
- **RichTextDraft** (`draft-js`) and **RichTextReactRTE** (`react-rte`)
  were removed: both depend on a version of `immutable` with a
  prototype-pollution/DoS vulnerability that has no upstream fix, and
  both are effectively unmaintained upstream.
- Use `RichTextQuill` (now on the maintained `react-quill-new` fork) or
  `RichTextTinyMCE` (now on the official `@tinymce/tinymce-react`,
  self-hosted) for rich text instead.
- **ImageCropPicker** was removed. Its stylesheet depends on a BEM mixin
  framework (`module`/`element`/`state` mixins) that isn't part of this
  repo, so it never compiled standalone.
- **ImageCrop** and **ColorPicker** work but come from heavily-patched
  legacy (originally CoffeeScript-derived) source — expect rough edges.
- Most components are still class components; hooks conversion has only
  been done for components with no refs and no lifecycle methods (~30 so
  far) to keep the risk of behavioral regressions low given there's no
  visual regression testing in place.
- `npm audit` reports 2 low-severity issues (a Quill XSS advisory via its
  HTML export feature, on the latest available `react-quill-new`/`quill`).
  No fix is available yet without downgrading.
