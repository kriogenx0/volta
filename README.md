# Volta

A React component library — 84 components covering forms, layout, feedback,
navigation, media, and rich text editing, plus a runtime theming API and a
styleguide.

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

**Coverage note:** the ~15 components that originate from Soda (Button,
Checkbox, Dropdown, Select, Tabs, Toggle, Tag, ProgressBar, ActionMenu,
FileManager, DropdownList, TextField, Radio) and anything built on top of
them fully track the accent color and light/dark mode. Most of Volta's
original components still use hardcoded colors and won't react to
`setAccentColor`/`setColorScheme` yet — migrating them onto the shared
tokens is the natural next step for full theme coverage.

## Development

```sh
make            # install, build components + styleguide, serve at :8888
make build      # just the component library bundle
make build-app  # just the styleguide app
make test       # run the test suite
make lint       # eslint components/
```

(Or the underlying `npm run <script>` commands directly — see
`package.json`.)

The styleguide (`app/` + `styleguide/`) renders every exported component:
curated, hand-written examples where they exist, and a default-props
render for everything else, plus a live accent color / light-dark / speed
switcher (`styleguide/ThemeSwitcher.jsx`).

## Testing

`npm test` runs Jest + React Testing Library against `components/**/*.test.jsx`.
Coverage is intentionally focused on components touched during the recent
modernization pass (`Button`, `Card`, `Select`, `Tooltip`, `PopOver`,
`ContentEditable`, `Theme`) rather than all 84 — most of the others have no
tests yet.

## Known gaps

- **Redactor** was removed. Its vendored editor (`redactor-lib.js`, a 2015
  jQuery plugin) requires a global `jQuery` and can't be made to work
  without jQuery, which conflicts with removing jQuery as a dependency.
  Use `RichTextQuill`, `RichTextTinyMCE`, `RichTextDraft`, or
  `RichTextReactRTE` instead.
- **ImageCropPicker** was removed. Its stylesheet depends on a BEM mixin
  framework (`module`/`element`/`state` mixins) that isn't part of this
  repo, so it never compiled standalone.
- **ImageCrop** and **ColorPicker** work but come from heavily-patched
  legacy (originally CoffeeScript-derived) source — expect rough edges.
- Most components are still class components; hooks conversion has only
  been done for components with no refs and no lifecycle methods (~30 so
  far) to keep the risk of behavioral regressions low given there's no
  visual regression testing in place.
- `AutoComplete`, `Form`, `List`, `ListTable`, `ModalAlert`, and `Search`
  are legacy `.cjsx` (CoffeeScript+JSX) sources with no build step for that
  extension, so they aren't part of `components/index.js`.
