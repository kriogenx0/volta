---
priority: p3
components: [Button]
branch: backlog/migrate-button-legacy-props
---

# Remove Button's legacy props once nothing uses them

The migration half is done on the branch above (see `docs/features/button.md`): the one use in this repository (`ClipboardHover`'s `tiny`) is migrated, the legacy handling is now tested, each legacy way (`bsStyle`, `tiny`, and `type` set to a variant name) warns once and says what to use, and `tests/noLegacyButtonProps.test.js` keeps them out of this repository.

## Blocked

The task's last step is to remove the legacy handling from `Button`. That breaks any app that still passes `bsStyle`, `tiny` or `type="primary"`, and the apps that consume this library are outside this repository. `Button.jsx` names one (`ironyoung-compat`: its Rails asset pipeline owns the real button look through a plain `.btn` class). Only you can say whether it's safe.

To finish: once no consumer passes them (the warnings will show in their consoles, so a release with them is a way to find out), delete from `components/Button/Button.jsx`:

- the `bsStyle`, `tiny` and `legacyType` handling, the `deprecated` helper and `Button.resetDeprecationWarnings`;
- `tiny` and `bsStyle` from `Button.propTypes`;
- `tests/Button/ButtonLegacy.test.jsx`'s "legacy props" block, and `tests/noLegacyButtonProps.test.js`;
- the "Deprecated" and "Not done" sections of `docs/features/button.md`.

Then delete this file.
