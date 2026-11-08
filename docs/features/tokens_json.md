# tokens.json

`styles/tokens.json` is the design tokens of `styles/_colors.scss` as data, so a tool or an AI agent can read the values instead of guessing them (`docs/project/design-system.md` says to read `tokens.json`, never guess). It is generated from the stylesheet and a test fails when the two differ, so they stay in sync.

## What it does for users

- **One machine-readable copy of the tokens.** Every `--v-*` custom property that `_colors.scss` declares, with its value in light and in dark:

  ```json
  {
    "generated": "From styles/_colors.scss by `make tokens`. Do not edit by hand.",
    "tokens": {
      "--v-accent": { "light": "#4A90E2", "dark": "#4A90E2" },
      "--v-color-base": { "light": "#ffffff", "dark": "#050505" }
    }
  }
  ```

  A token the dark palette doesn't override has the same value in both, as it does in the browser. Every `--v-*` property the stylesheet declares: the colours a theme can set (the list in `Theme.tokens`), the focus ring, the animation tokens (`--v-anim-speed`, `--v-anim-ease`), and the scale tokens (space, radius, shadow and z-index). Values are as written in the stylesheet (`#4A90E2` keeps its case).
- **Can't drift.** `tests/tokensJson.test.js` regenerates the file's text from the stylesheet and fails if the committed file differs, so a colour added, renamed or changed in `_colors.scss` fails the test until `make tokens` is run and the result committed. It also fails when the file is edited by hand, and when the file leaves out a token in `Theme.tokens` or the animation tokens.

## How it is made

```bash
make tokens    # UPDATE_TOKENS=1 npx jest tests/tokensJson.test.js, rewrites styles/tokens.json
```

`util/colorTokens.js` reads the `:root` block (light) and the `@mixin dark-palette` block (dark overrides) of `_colors.scss`. The test is the generator: with `UPDATE_TOKENS=1` it writes the file first, then checks it. No new tooling.

Tests: `tests/tokensJson.test.js` (parsing, a missing block, the committed file equal to the generated one, the keys include `Theme.tokens` and the animation tokens). Mutation-checked: changing the accent in the stylesheet, renaming a key in the JSON, and not reading the dark palette each fail it; `make tokens` after a stylesheet change rewrites the file and the test passes.

## Known limits

- **Only what `_colors.scss` declares.** The design-system artifact's own `tokens.json` also names type tokens, which aren't `--v-*` properties in this repo yet (`docs/backlog/snap-type-to-scale.md`); when they are declared in a stylesheet, extend `util/colorTokens.js` to read that file too.
- **Not synced to the artifact.** Updating the artifact's copy needs its account and network access; see `docs/backlog/sync-tokens-json.md`.
- It is not shipped in the package's compiled bundle; it is a repo file.

## History

- Implemented 2026-11-06 on branch `backlog/sync-tokens-json`. Not merged or deployed.
