---
priority: p2
components: [Calendar, DatePicker, DateInput, Label]
---

# Remove the duplicated and dead date code

## Objective

`components/Calendar/Dater.js` and `components/DatePicker/Dater.js` started as exact copies. Both had the same bugs (`daysInMonth` wrong for the 29th to 31st, `nextMonth` jumping from Jan 31 to Mar 3, mutating the caller's `Date`) and were fixed separately, so they can drift again. There is also dead code in the same area.

## Requirements

- One date helper in a shared util folder, used by `Calendar` and `DatePicker`, with its tests (`tests/Calendar/Dater.test.js`) moved with it.
- Decide, with the owner, whether to delete the unwired `DatePicker/DateTimeInput.jsx` and `DateTimeRange.jsx` (they import `jquery` and `formsy-react`, which are not dependencies) and `Label/Label.scss` (never imported; targets a class that doesn't exist).
- Keep `DatePicker` and `Calendar` behaviour identical: same props, same class names.

## Acceptance criteria

- No two copies of the month arithmetic remain.
- Existing Calendar, DatePicker and DateInput tests pass unchanged.
