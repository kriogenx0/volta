# Dependencies: moment and lodash stay out of new code

`moment` and `lodash` are in the dependency list but shouldn't grow. New code uses the platform, `date-fns` or `luxon` (both already dependencies), and the files that use the old ones today are tracked so they can be removed.

## The rule

- **No new file imports `moment` or `lodash`** (including `lodash/map` and `lodash-es`) in `components/`, `util/`, `styleguide/` or `examples/`.
- Instead: array and object methods and optional chaining for lodash; `date-fns` (`format`, `isBefore`, ...) for dates, as `util/dateTimeUtils.js` and `DatePicker` do.

## What enforces it

`tests/noMomentLodash.test.js` lists the files that import them today (2 for moment, 29 for lodash). It is a ratchet in both directions: a new file that imports either fails, naming it; and a listed file that no longer imports it fails too, telling you to shrink the list. It recognises `from`, side-effect `import 'x'`, `require('x')` and `import('x')`, ignores comments, and doesn't confuse `momentum` or `lodash.something` for the libraries. It also found two lodash users (`Loader`, `MultiSelect`, which import by path) that a plain search had missed.

## The plan

- **lodash**: `docs/backlog/replace-lodash-with-native.md`. Twelve functions, each with its native replacement and the files that use it; mechanical and safe in batches. At the end, the global `_` that `jest.setup.js` provides for legacy files goes too, and `lodash` leaves `package.json`.
- **moment**: `docs/backlog/replace-moment-with-date-fns.md`. One real use, `DateFormat`, which is a public export taking moment-style format strings (`'MMMM D, YYYY'`). date-fns uses different tokens (`'MMMM d, yyyy'`; it throws on `YYYY`) and has no exact `fromNow`, so the swap is a decision about that API, not a mechanical change, and is waiting on one.

## Known limits

- Only imports are checked. A file that uses a global `_` without importing it (legacy code that relied on the webpack `ProvidePlugin`) isn't counted. None does today (`util/FileUtil.js` only mentions it in a comment).
- Nothing stops a new dependency that does the same job under another name; this is a rule about these two.

## History

- 2026-11-06 (branch `backlog/drop-moment-and-lodash`, not merged or deployed): the ratchet, and the two follow-up tasks. Nothing was removed.
