---
priority: p1
branch: backlog/after-merging-the-backlog-branches
---

# After the backlog branches are merged

Each `backlog/*` branch was built from `origin/main` on its own and passes its own checks. Merged together they conflict in a few places and three guard tests need a refresh, found by merging all 24 branches into a scratch copy of `origin/main` (not pushed) on 2026-11-06 and running every check. Do this task **only once the branches it names are merged**: run `git branch -r --no-merged origin/main | grep backlog/` first; if any branch it mentions is still unmerged, skip the matching step and leave this file.

On the merged state (with the conflicts below resolved) lint had 0 errors, `npm run build`, `npm run build-app` and `make bundle` all built, and jest passed except for the three suites in "Guard tests".

## Merge conflicts, and how they were resolved

Branches were merged in alphabetical order; every conflict is small. Resolving them the same way keeps everything.

| File | Branches | Resolution |
| --- | --- | --- |
| `docs/features/README.md` | nearly every branch (each adds its own index line) | keep every line |
| `docs/features/theming.md` | `fix-dark-mixin`, `resolve-contrast-failures` | keep both sections ("Dark mode in component styles" and "Contrast") |
| `docs/README.md` | `publish-design-system-bundle`, `write-design-system-component-guidelines` | keep both paragraphs (the `make bundle` pointer and the component README pointer) |
| `Makefile` (`.PHONY` line) | `publish-design-system-bundle`, `sync-tokens-json` | one line with both `bundle` and `tokens` |
| `components/FileUploader/FileUploader.jsx` | `audit-interactive-states`, `replace-font-awesome-icons-and-fix-file-size` | keep `asButton(...)` (keyboard access) on the two action `div`s and use `<Icon type="arrow-up-circle" />` and `<Icon type="times-circle" />` instead of the `fa` classes; import both `asButton` and `Icon` |
| `styleguide/views/ComponentExamples/componentGroups.js` | `add-styleguide-smoke-test`, `link-field-label-hint-error` | keep the smoke test's removal of `BaseInput` and `FormRow` from the Forms group (it removed them on purpose) and add only `FieldHint`: `'DatePicker', 'Label', 'Field', 'FieldLabel', 'FieldHint', 'FieldRow'` |

## Guard tests to refresh

These tests exist to fail when something drifts; after the merge they do, as designed.

1. **`tests/tokensJson.test.js`**: `styles/_colors.scss` changed on other branches (a darker tertiary gray, `--v-color-danger-hover`, `--v-focus-ring`, spacing, radius, shadow and z-index tokens). Run `make tokens` and commit `styles/tokens.json`.
2. **`tests/interactiveStates.test.jsx`** ("has no exception that is no longer found"): `DateInput: div` and `DatePicker: div` are in the list of known exceptions but are no longer found once the Dropdown and date branches are merged. Remove those two entries from `EXCEPTIONS`.
3. **`tests/componentReadmes.test.js`**: other branches change props and add exports, so these READMEs no longer list every propType: `ActionMenu` (`aria-label`), `Button` (`tiny`), `CloseButton` (`size`), `Dropdown` (`closeOnContentClick`), `Field` (`hint`), `FieldRow` (`hint`), `Modal` (`modal`), `PopOver` (`modal`), `RichTextTinyMCE` (`disabled`), `Select` (`hint`), `TextField` (`hint`); the new `FieldHint` component needs a README (`components/FieldHint/README.md`, format in `docs/features/component_guidelines.md`); and the `Map` README must mention the new `setGoogleMapsKey` and `getGoogleMapsKey` exports in a heading. The test names the first missing prop of each; add every new propType to its table, and update the prose that changed with the behaviour (for example, the READMEs say that `Button` has legacy props, that the overlays don't trap focus, that `ActionMenu`'s label is fixed, that `Field` has no hint, that `Map` hard-codes its key: fix each sentence the merged branches made untrue). Do this one last, since it depends on which branches were merged.

## Acceptance criteria

- `make test`, `make lint`, `npm run build`, `npm run build-app` and `make bundle` all pass on `origin/main` after the merges.
- Every README sentence that a merged branch made untrue is corrected.
- This file is deleted.

## Unverified

The trial merge was in a scratch directory, with jest, lint and the builds only: nothing was looked at in a browser, so visual conflicts (for example the icon change and the keyboard handlers on `FileUploader`) are unchecked.
