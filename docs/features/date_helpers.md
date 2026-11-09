# Date helpers (`Dater`)

`Dater` is the small date class behind the month grids of `Calendar` and `DatePicker`. It lives in `util/Dater.js`, and both components import that one copy. (It used to be duplicated in `components/Calendar/` and `components/DatePicker/`, which could drift apart.)

## What it does

A `Dater` wraps a `Date` and moves it around by month.

- `new Dater(date)` takes a `Date`, a `Dater`, a timestamp or a date string. It always works on its own copy, so moving a `Dater` never changes what it was made from. Nothing, or something unreadable (`'nonsense'`, `new Date('nope')`), means today.
- Reading: `day()`, `dayOfWeek()` (0 is Sunday), `month()` (1 to 12), `monthName()`, `year()`, `daysInMonth()`, `format()` / `mdy()` (`5/7/2026`).
- Changing, which returns the `Dater` so calls chain: `day(n)` with an argument, `firstDayOfMonth()`, `lastDayOfMonth()`, `nextMonth(n)`, `previousMonth(n)`, `now()`.
- Copying: `clone()` (a new `Dater`), `cloneDate()` (a new `Date`).
- Tables: `Dater.dayAbbreviation`, `Dater.dayList`, `Dater.monthList`.

`nextMonth` and `previousMonth` stay in the target month when it is shorter: January 31 plus a month is February 28 (or 29), not March 3. `daysInMonth()` is right for any day of the month.

The changing methods **mutate**. Components therefore make a new `Dater` for each change (`dater.clone().nextMonth()`) so React sees it change.

## Who uses it

- `components/Calendar/Calendar.jsx`: its `onDateSelect` receives a `Dater`, and its `date` prop accepts one.
- `components/DatePicker/Calendar.jsx`: the calendar inside `DatePicker` (also exported as `DateInput`).

## Tests

`tests/util/Dater.test.js` covers the class, including the month arithmetic and the unreadable-date fallback. `tests/Calendar/` and `tests/DatePicker/` cover the components that use it.

## Removed dead code

Three files that nothing imported are gone: `components/DatePicker/DateTimeInput.jsx` and `DateTimeRange.jsx` (they needed `jquery`, `jquery-datetimepicker` and `formsy-react`, none of which are dependencies) and `components/Label/Label.scss` (never imported, and it styled a class `Label` doesn't render). Version history is the reference if a rewrite is ever wanted; for a date field use `DatePicker` / `DateInput`.

## History

- 2026-11-05 (branch `backlog/dedupe-date-helpers-and-remove-dead-date-code`, merged, not deployed): the two copies became one in `util/`; the duplicate `Dater` tests in `tests/DatePicker/` were removed (all were covered by `tests/util/Dater.test.js`, and the one extra case, an invalid `Date` object, was added there).
- 2026-11-08 (branch `backlog/replace-moment-with-date-fns`, not merged or deployed): the three dead files above were deleted, as the owner decided, after a search showed nothing in `components/`, `util/`, `styleguide/`, `examples/` or `tests/` imports them. `Label` has no stylesheet, as before (it never imported one).
- Not verified in a browser; the behaviour is covered by tests only.
