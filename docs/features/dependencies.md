# Dependencies: moment and lodash stay out of new code

`lodash` has been removed. `moment` is still a dependency but shouldn't grow: new code uses the platform, `date-fns` or `luxon` (both already dependencies), and the files that still use `moment` are tracked so they can be removed.

## The rule

- **No new file imports `moment` or `lodash`** (including `lodash/map` and `lodash-es`) in `components/`, `util/`, `styleguide/` or `examples/`.
- Instead: array and object methods and optional chaining for lodash; `date-fns` (`format`, `isBefore`, ...) for dates, as `util/dateTimeUtils.js` and `DatePicker` do.

## What enforces it

`tests/noMomentLodash.test.js` lists the files that import `moment` today (2) and has an empty list for `lodash`. It is a ratchet in both directions: a new file that imports either fails, naming it; and a listed file that no longer imports it fails too, telling you to shrink the list. It recognises `from`, side-effect `import 'x'`, `require('x')` and `import('x')`, ignores comments, and doesn't confuse `momentum` or `lodash.something` for the libraries. 

## The plan

- **lodash**: done. See What replaced lodash, below.
- **moment**: `docs/backlog/replace-moment-with-date-fns.md`. One real use, `DateFormat`, which is a public export taking moment-style format strings (`'MMMM D, YYYY'`). date-fns uses different tokens (`'MMMM d, yyyy'`; it throws on `YYYY`) and has no exact `fromNow`, so the swap is a decision about that API, not a mechanical change, and is waiting on one.

## What replaced lodash

- **Plain Array and object methods and optional chaining** wherever the value is surely an array: `includes`, `filter`, `map`, `a?.b`, `Array.from({ length: n }, ...)`, `Object.fromEntries`.
- **Helpers in `util/`** where the platform has no equal, each with tests in `tests/util/collectionUtils.test.js`:
  - `collection.js`: `map` and `each` for a value that may be an array, an array-like (a `FileList`), a plain object (`Tabs` takes `{ key: label }`) or nothing. They behave as lodash's did, including not skipping holes and stopping `each` when the callback returns `false`.
  - `range.js`: `range(start, end, step)`, counting up or down.
  - `debounce.js`: `debounce(fn, wait)` with `cancel` and `flush`.
  - `isEqual.js`: a deep compare of primitives (NaN equals NaN), arrays, plain objects, dates and regular expressions, safe against a value that contains itself.

## Known limits

- Only imports are checked. A file that uses a global `_` without importing it (legacy code that relied on the webpack `ProvidePlugin`) isn't counted. None does today (`util/FileUtil.js` only mentions it in a comment).
- Nothing stops a new dependency that does the same job under another name; this is a rule about these two.

## History

- 2026-11-06 (branch `backlog/drop-moment-and-lodash`, not merged or deployed): the ratchet, and the two follow-up tasks. Nothing was removed.
- 2026-11-10 (local, not merged or deployed): `lodash` removed from all 30 files that imported it, from `package.json` and the lockfile, and the global `_` from `jest.setup.js`; the four helpers added to `util/`. The suite, lint and both builds pass; nothing was checked in a browser, so the components that changed (the tab, list, menu, calendar, picker and file components) are covered by their jsdom tests only.
