# Bundle (`bundle.js` and `bundle.css`)

`make bundle` builds the component library as two plain files, a script and a stylesheet, for a page that loads them with `<link>` and `<script>` tags. It is the build to hand to something that isn't a JavaScript app with a bundler, such as a design-system reference page that wants live previews of the components.

## What it produces

```bash
make bundle        # same as: npm run build -- --mode bundle
```

writes exactly these two files to `components/compiled/bundle/` (git-ignored, emptied on every run):

| File | What it is |
| --- | --- |
| `bundle.js` | A UMD script that defines `window.volta` with every export of `components/index.js` (101 at the time of writing). Production build (minified) with `process.env.NODE_ENV` replaced by `"production"`. |
| `bundle.css` | Every component's stylesheet and the theme tokens, in one file. The script does not inject it. |

The default build empties `components/compiled`, `bundle/` included, so run `make bundle` last.

The default build (`npm run build`, `make build`, `make build-prod`) is unchanged: one `components/compiled/components.js` that injects its own CSS. Both come from the same `vite.config.mjs`; `--mode bundle` only switches the CSS to a file, replaces `process.env.NODE_ENV`, and changes the output folder and file names.

## What the page has to provide

The bundle leaves `react`, `react-dom`, `react-dom/client` and `react-router-dom` out, so the page must define these globals **before** loading `bundle.js`:

| Global | Must be |
| --- | --- |
| `React` | React 19 |
| `ReactDOM` | `react-dom` **and** `react-dom/client` (the bundle reads `createRoot` from it for toasts) |
| `ReactRouterDOM` | `react-router-dom` |

React 19 no longer ships UMD builds (`react/umd/...` is gone), so there is no file to point a `<script>` tag at. The page builds the globals itself, from an ESM CDN module or from its own bundle:

```html
<link rel="stylesheet" href="bundle.css">
<script type="module">
  import * as React from 'react';
  import * as ReactDOM from 'react-dom';
  import * as ReactDOMClient from 'react-dom/client';
  import * as ReactRouterDOM from 'react-router-dom';
  window.React = React;
  window.ReactDOM = { ...ReactDOM, ...ReactDOMClient };
  window.ReactRouterDOM = ReactRouterDOM;
  await import('./bundle.js');   // defines window.volta
  const { Button, Theme } = window.volta;
</script>
```

(The bare specifiers need an import map or a bundler. The point is only that all three globals exist before `bundle.js` runs.) The bundle must share the page's one copy of React; a second copy breaks hooks.

## Tests and checks

There is no automated test for the bundle; `make bundle` is checked by hand with a throwaway script (not committed) that:

- builds the bundle and confirms it holds no `process.env` reference and only the four `require(...)` calls of the UMD wrapper (`react`, `react-dom`, `react-dom/client`, `react-router-dom`);
- evaluates `bundle.js` in jsdom with `React`, `ReactDOM` and `ReactRouterDOM` provided, and checks that `window.volta` has the exports;
- server-renders `volta.Button` and an indeterminate `volta.ProgressBar` with it, and checks that no `<style>` tag was injected.

All three held on 2026-11-06. Before the `react-dom/client` externalization the bundle failed to load (`require is not defined`): `ToastMessage` imports `react-dom/client`, which Rollup bundled as a CommonJS copy that `require`s React. Anything new that imports a subpath of `react`, `react-dom` or `react-router-dom` has to be added to `external` and `globals` in `vite.config.mjs`.

## Known limits

- **Not verified in a real browser.** The load was checked in jsdom only; the stylesheet was not looked at on a page, and `ToastMessage` was not exercised from the bundle.
- **Not published anywhere.** This only builds the files. Adding them to the external design-system artifact (live previews there) needs the artifact's account and network access, which this environment doesn't have; see the task file `docs/backlog/publish-design-system-bundle.md`.
- **The bundle carries its own copies of everything else** (`moment`, `jquery`, `react-select`, `date-fns` and the rest of its dependencies), so it is large (about 750 kB, 234 kB gzipped).
- **Production only.** There is no unminified or sourcemapped bundle mode; use `make build` for that.

## History

- Implemented 2026-11-06 on branch `backlog/publish-design-system-bundle`. Not merged or deployed. Not implemented: publishing to the artifact, live previews there.
