# Volta as a base layer

Volta is meant to be the bottom layer of an app's design system, not the whole of it. An app installs a tagged Volta release, uses Volta's tokens and components as they are, themes them, and keeps its own layer on top for anything that is specific to the app. Volta stays generic so every app built on it can upgrade to the next release.

## The layers

1. **Volta (base).** Tokens (`--v-*` custom properties in `styles/_colors.scss`, the spacing, radius, type, shadow and z-index scales in `styles/_variables.scss`), the mixins (`mixins.scss`) and the components (`import { Button } from 'volta'`).
2. **The app's theme.** The app's colours, set over Volta's tokens with `Theme.applyTheme(...)` or a stylesheet that redefines `--v-*` (see [theming.md](theming.md)). This changes values, never names.
3. **The app's own tokens and components.** Everything Volta doesn't have, under the app's own prefix, defined in the app's repo.

Each layer only reads from the one below it. Volta never knows about the app.

## Use Volta's token when one fits

If Volta has a token for the meaning, use it, even when the app wants a different value; change the value in the app's theme.

| App need | Use |
| --- | --- |
| Error, destructive action | `--v-color-danger`, `--v-color-danger-subtle` |
| Success, done | `--v-color-success` |
| Warning, at risk | `--v-color-warning` |
| Brand / primary action | `--v-accent`, `--v-accent-hover`, `--v-accent-subtle`, `--v-on-accent` |
| Disabled, placeholder | `--v-color-inactive` |
| Surfaces and borders | `--v-color-base` and its `-more-subtle`, `-subtle`, `-less-subtle` steps |
| Text | `--v-color-trim` and its steps |
| Motion | `--v-anim-speed`, `--v-anim-ease` |

## Define the app's own token when none fits

When the app needs a meaning Volta doesn't have, define it in the app, not in Volta. For example, an app with task statuses needs "in progress", "blocked" and "in review" colours that no other app needs:

```scss
// In the app, e.g. src/styles/_tokens.scss, loaded after Volta's styles
:root {
  // Built from Volta where a Volta meaning exists...
  --app-status-done: var(--v-color-success);
  --app-status-blocked: var(--v-color-danger);
  // ...and the app's own values where none does
  --app-status-in_progress: #2f6fd6;
  --app-status-in_review: #8a4fd1;
}

:root[data-theme='dark'] {
  --app-status-in_progress: #6fa0f0;
  --app-status-in_review: #b48cec;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --app-status-in_progress: #6fa0f0;
    --app-status-in_review: #b48cec;
  }
}
```

The rules for an app's layer:

- **Use the app's own prefix** (`--app-*`, or the app's name), never `--v-*`. A `--v-*` name belongs to Volta and may change meaning or be removed in a later release; an app name never collides.
- **Alias Volta where the meaning matches** (`--app-status-done: var(--v-color-success)`), so a Volta theme still recolours it.
- **Give every colour a dark value**, under the same `[data-theme]` and `prefers-color-scheme` selectors Volta uses (see `styles/_colors.scss`), so the app follows `Theme.setColorScheme`.
- **Build app components from Volta components** (compose or wrap a `Button`, a `Field`) rather than copying their markup or styles.

## When something belongs in Volta instead

Move a token or component into Volta only when it is generic: more than one app would want it, and it doesn't name anything from one app's domain. "Info" or a fourth status colour might qualify; "blocked task" does not. Add it in Volta the usual way (a token in `styles/_colors.scss`, a component with its examples and tests), release a new tag, and then have the app switch from its own token to Volta's.

## Upgrading

An app pins a tag (`github:kriogenx0/volta#v3.0.0`, see Install and Releases in [docs/README.md](../README.md)). To upgrade, change the tag and reinstall. Because the app only reads `--v-*` names and never defines them, a release that changes Volta's values restyles the app without breaking it; a release that renames or removes a token says so in its Releases note.

## Tests

This is a convention for apps, not code in Volta, so nothing here tests it. Volta's side of it, that the tokens a theme may set match `styles/_colors.scss`, is checked by `tests/themePreset.test.js`.

## History

- Implemented 2026-11-09: documented Volta as the base layer for apps (Inertia first), added the `prepare` build so a Git install ships `components/compiled/`, and tagged `v3.0.0`.
