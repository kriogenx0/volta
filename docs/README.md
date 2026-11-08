# Volta

A React 19 component library — 92 components covering forms, layout,
feedback, navigation, media, and rich text editing, plus a runtime theming
API and a styleguide. Built with Vite.

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
<!-- window.React, window.ReactDOM and window.ReactRouterDOM must exist first.
     React 19 ships no UMD builds, so the page has to create them (see features/bundle.md). -->
<script src="node_modules/volta/components/compiled/components.js"></script>
<script>
  const { Button } = volta;
</script>
```

For a page that loads the library with plain tags and wants the stylesheet as its
own file, `make bundle` builds `bundle.js` and `bundle.css`
([docs/features/bundle.md](features/bundle.md)).

`TextBox` is an alias for `TextField` (it adds a `c-text_box` wrapper class for
ironyoung-web's own styles); both are exported. `SegmentedControlMini` is an
alias for `<SegmentedControl mini />`; both are exported. `LoaderLinearProgress`
is an alias for `<ProgressBar fixed variant="flowing" />` (a bar pinned to the
top of the window; its `progress` prop is `ProgressBar`'s `percent`); both are
exported. `ProgressBar` is indeterminate when given `indeterminate`, or when
`percent` isn't a number.

Run `npm run build` (or `make build-prod`) after cloning/updating — the
compiled bundle isn't committed. (`make build` produces the same bundle
unminified with a sourcemap, for development.)

`RichTextTinyMCE` self-hosts TinyMCE (no tiny.cloud API key needed): the
build copies `node_modules/tinymce` to `components/compiled/tinymce/` and
the component points `tinymceScriptSrc` at it. If you consume the library
via `npm link`/`file:` rather than the built bundle, copy that directory
into your own app's public assets and adjust `tinymceScriptSrc`
accordingly.

## Theming

The whole look comes from 19 CSS custom properties (`--v-*`, declared in
`styles/_colors.scss`), so a theme is a small object and replacing it needs no
rebuild. Details, the theme format, how to add or replace one, and the limits
are in [docs/features/theming.md](features/theming.md).

```js
import { Theme } from 'volta';

// Replace the whole look: a preset id (Theme.presets) or your own theme object
Theme.applyTheme('ocean');
Theme.applyTheme({ id: 'brand', light: { '--v-accent': '#0b6b3a' }, dark: { '--v-accent': '#4fd18b' } });
Theme.resetTheme(); // back to styles/_colors.scss

// A custom accent over the theme; hover, tint and label colour are derived
Theme.setAccentColor('#e0405c');
Theme.resetAccentColor();

// 'light' | 'dark' | 'system' (follows the OS by default); a theme has a light
// and a dark half and the scheme that is showing picks one
Theme.setColorScheme('dark');
Theme.getColorScheme();

// Global transition/animation duration (default 150ms). Accepts a number
// of milliseconds or a CSS duration string.
Theme.setAnimationSpeed(300);
Theme.setAnimationSpeed('0.3s');
Theme.resetAnimationSpeed();
```

Under the hood this sets the tokens as inline custom properties on `<html>` and
toggles `[data-theme]`. The same tokens can be overridden from a plain
stylesheet instead, with no JavaScript.

**Coverage note:** a component that uses only the tokens (or the `$color_*` Sass
aliases, which resolve to them) follows every theme and both schemes. Only
`GlobalNav.scss` and `Loader.scss` still hard-code hex colours, and those keep
their colours whatever the theme.

## Development

```sh
make            # list every target, grouped by category (same as make help)
make setup      # install dependencies
make dev        # Vite dev server with HMR, opened in the browser
make up         # build and run the styleguide in Docker (see below)
make down       # stop it
make running    # is the styleguide answering?
make build      # component library bundle, unminified with a sourcemap
make build-prod # the same bundle, minified
make build-app  # just the styleguide app
make test       # run the test suite
make lint       # eslint components/
make start      # build components, then serve the styleguide
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
make up
```

Then open <http://localhost:8888>. `make up` runs attached (Ctrl-C stops it)
and stops any previous run first; `make down` stops and removes the container.
The container runs `make run` with the source bind-mounted for HMR; it does not
build or publish the component-library bundle. Its health check requests the
dev server's root URL.

The Dockerfile and Compose file are in `styleguide/`. Use `make docker-build`
to build the image without starting it. Override the host port with
`STYLEGUIDE_PORT=3000 make up`.

There is no database or other service, so there is nothing to seed and
nothing that could reach a live service.

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

`make test` (`npm test`) runs Jest + React Testing Library over `tests/`, one
folder per component. Jest compiles JSX with the automatic runtime, the same
as the Vite build; the classic runtime applies `defaultProps` to function
components and React 19 doesn't, which let tests pass while the built app lost
those defaults. `jest.setup.js` stubs the browser APIs jsdom lacks
(`URL.createObjectURL`, `matchMedia`, `ResizeObserver`, `IntersectionObserver`,
`scrollTo`, media playback).

Tests that apply to every component:

- `tests/examples.test.jsx`: each component registered in the styleguide has
  at least two examples, each with its own name and code, and every example
  renders (inside a `MemoryRouter`, as in the styleguide) with no error and no
  React warning. A new component needs its examples registered there.
- `tests/noUtilityClasses.test.js`: no Tailwind-style utility classes.
- `tests/noFunctionDefaultProps.test.js`: function components take defaults as
  parameters (`({ size = 'md' }) =>`), never `defaultProps`; class components
  may keep it.
- `tests/noClassComponents.test.js`: no new class components (error boundaries
  excepted); the one left, `Map`, is listed and the list can only shrink.

`make lint` runs ESLint over `.js` and `.jsx`.

Not covered: nothing is checked in a real browser, so styles and layout are
unverified by the suite. Components that need a real engine are tested against
fakes: Google Maps (`tests/Map/fakeGoogleMaps.js`), Howler, canvas and `Image`
for `ImageCrop`, CKEditor 4, and TinyMCE (whose script is never fetched).
`UserMap` and `TableList` have no tests because `leaflet` and `jquery` aren't
installed.

## Services

- **Google Maps** (JavaScript API, Places and Geocoder), used by `Map` and
  `MapSelector` to draw a map, find an address and suggest addresses. It needs one
  API key, set once at startup with `setGoogleMapsKey(key)`; the library has no
  default, and without a key a message replaces the map. See
  [docs/features/map.md](features/map.md), including how the styleguide reads
  `VITE_GOOGLE_MAPS_API_KEY` from a git-ignored `.env.local`.

## Unwired components

A few components exist in the source but are **not** wired into `index.js`,
because they depend on packages or a Backbone-style data layer that don't
exist in this repo (same treatment as the already-excluded
`ImageCropPicker`) — each file's header comment explains exactly what's
missing:

- `DatePicker/DateTimeInput.jsx` / `DateTimeRange.jsx` — need `jquery` +
  the xdsoft jQuery datetimepicker plugin, and `formsy-react`. Use
  the maintained `DateInput` or `DatePicker/DatePicker.jsx` instead.
- `Search/SearchStore.jsx` and `TableList/TableList.jsx` /
  `TableListRow.jsx` — expect Backbone-style collections/models
  (`.get()`, `.models`, `.at()`, change listeners); `TableList` also needs
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
  legacy source — expect rough edges.
- Hooks are the preferred style (see `docs/project/design-system.md`), and every
  component is a function component except `Map`, the one class left (it waits
  for the Google Maps key task, which edits the same file; see
  `docs/features/function_components.md`). Error boundaries stay classes. There
  is no visual regression testing, so a conversion is checked by its unit tests
  and, for the interaction-heavy ones, by hand in a browser.
- `npm audit` reports 2 low-severity issues (a Quill XSS advisory via its
  HTML export feature, on the latest available `react-quill-new`/`quill`).
  No fix is available yet without downgrading.
