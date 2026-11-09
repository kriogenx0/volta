---
priority: p3
components: [DateFormat, DatePicker]
---

# Replace moment: decide what happens to DateFormat's format strings

moment is imported by one file, `components/DatePicker/DateFormat.js` (the only other user, the unwired `DateTimeInput.jsx`, was deleted). That use is a **public export**: `DateFormat` (`components/index.js`) turns a date into text, taking a moment-style `format` string and a `fromNow` flag.

## Why this isn't a straight swap

The rest of the library formats dates with **date-fns** (`'MMM d, yyyy'`, in `util/dateTimeUtils.js` and `DatePicker`). The two libraries use different format tokens for the same thing:

| Meaning | moment | date-fns |
| --- | --- | --- |
| Year | `YYYY`, `YY` | `yyyy`, `yy` (date-fns throws on `YYYY`) |
| Day of the month | `D`, `DD` | `d`, `dd` |
| Weekday name | `dddd`, `ddd` | `EEEE`, `EEE` |

and `fromNow` ("a few seconds ago", "2 hours ago") has no exact twin: date-fns's `formatDistanceToNow` says "less than a minute ago", "about 2 hours ago". So a caller who passes `format="MMMM D, YYYY"` today would get an error, or different text, after a swap. The default is `'MMMM D, YYYY'`, so even `DateFormat` with no format would change.

## Blocked

It needs a decision about the API, which is yours (and depends on who calls `DateFormat` outside this repository):

- **Translate**: keep the moment-style strings and convert the tokens to date-fns's inside `DateFormat` (a small, tested mapping for the tokens people use). No breaking change, but the moment vocabulary stays. `fromNow` would be reworded or kept as is by using `formatDistanceToNow` with a note.
- **Change the API** to date-fns tokens, like the rest of the library: simple and consistent, a breaking change for callers.
- **Keep moment** for now: it is one file, but moment is a large dependency (and in maintenance mode) for one function.

To finish: pick one, change `DateFormat.js` and its test (`tests/DatePicker/DateFormat.test.jsx`, which today checks `format: 'M/D/YY'` and the empty value), remove the file from `MOMENT_FILES` in `tests/noMomentLodash.test.js`, and when the list is empty delete `moment` from `package.json` and the lockfile.
