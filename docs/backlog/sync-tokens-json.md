---
priority: p3
branch: backlog/sync-tokens-json
---

# Keep tokens.json in sync with _colors.scss

Keep `tokens.json` in sync when `_colors.scss` changes; consider generating one from the other.

## Done on the branch

`styles/tokens.json` is generated from `styles/_colors.scss` (`make tokens`) and a test fails when they differ (see [docs/features/tokens_json.md](../features/tokens_json.md)). The colour and animation tokens are covered.

## Blocked

The design-system artifact's own `tokens.json` (https://claude.ai/artifact/NvqB2qq26do7JhME6sBdDY) is the one `design-system.md` points at, and it also has space, radius, shadow, z-index and type tokens that don't exist as `--v-*` properties in this repo. Two things only the user can do: copy `styles/tokens.json` into the artifact (or merge it into the artifact's file) when the colours change, and decide where the non-colour tokens live (`add-missing-design-tokens` adds them to the stylesheets; once it merges, extend `util/colorTokens.js` to read them so the generated file covers them too).
