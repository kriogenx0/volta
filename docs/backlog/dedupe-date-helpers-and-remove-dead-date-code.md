---
priority: p2
components: [Calendar, DatePicker, DateInput, Label]
branch: backlog/dedupe-date-helpers-and-remove-dead-date-code
---

# Delete the dead date code?

The duplication half is done on the branch above: `Dater` is one copy in `util/Dater.js`, used by `Calendar` and `DatePicker`, with its tests in `tests/util/` (see `docs/features/date_helpers.md`).

What remains is a decision, so it is left alone.

## Blocked

Whether to delete three files that nothing uses:

- `components/DatePicker/DateTimeInput.jsx` and `DateTimeRange.jsx`: not wired into `components/index.js`, and they import `jquery`, `jquery-datetimepicker` and `formsy-react`, which are not dependencies (jQuery was removed from the repo). Their header comments say they are "kept for reference/future rewrite", so someone chose to keep them.
- `components/Label/Label.scss`: never imported, and it targets a class that doesn't exist.

Deleting is safe for the build (nothing imports them; `grep -rnE "DateTimeInput|DateTimeRange|Label/Label\.scss|import '\./Label\.scss'" components styleguide examples tests --include=*.js --include=*.jsx --include=*.scss`, ignoring `components/compiled/` and the two DateTime files, finds nothing). It is a question of intent: keep them as a reference for the rewrite, or let git history be the reference.

To finish: if they should go, delete the three files (and the `DateTimeInput` / `DateTimeRange` entries under "Unwired components" in `docs/README.md`, if listed), then delete this file. If they should stay, delete this file and the "Not used" section can stay as it is.
