---
priority: p3
components: [Calendar, DatePicker, Tabs, Loader, MultiSelect, FilePicker, TagInput, TimePicker, AutoComplete, SearchSelector]
---

# Replace lodash with the platform

lodash is imported by 29 files (listed in `tests/noMomentLodash.test.js`, which stops new ones). It is used lightly: twelve functions, all of which the platform covers. Removing it is mechanical, safe to do a few files at a time, and each file you finish shrinks that list.

## What is used, and what replaces it

| lodash | Used in | Instead |
| --- | --- | --- |
| `map` | 17 files, among them Tabs, TabsRouted, TabBar, TagInput, RadioGroup, CheckboxGroup, DropdownList, AutoComplete, SearchSelector, GlobalNav, FileManager, FilePicker, ActionMenu, ListDefinitions, ColorPalettePicker and both calendars | `array.map(...)`. Where it maps an **object** (Tabs and TabsRouted accept `{ key: label }` as well as an array), use `Object.entries(object).map(([key, value]) => ...)` |
| `each` | NavBar, FilePicker, FilePicker/filetyper | `forEach` (arrays) or `Object.entries(...).forEach` |
| `includes` | TagInput, CheckboxGroup, VideoUploadPlayer, FileUploader | `array.includes(x)`, `string.includes(x)` |
| `get` | MapSelector, VideoUploadPlayer, FileUploader, FilePicker | optional chaining: `a?.b?.c` (`?? fallback` for a default) |
| `range` | TimePicker | `Array.from({ length: n }, (_, i) => start + i)` |
| `times` (`lodash/times`) | Loader | `Array.from({ length: n }, (_, i) => ...)` |
| `without` | TagInput, FilePicker | `array.filter((x) => x !== value)` |
| `compact` | FileManager | `array.filter(Boolean)` |
| `keyBy` | the styleguide's component list (`Components-examples.jsx`) | `Object.fromEntries(array.map((x) => [x.name, x]))` |
| `escapeRegExp` | Link | `text.replace(/[.*+?^${}()\|[\]\\]/g, '\\$&')` |
| `debounce` | Search/SearchStore | a small `util/debounce.js` (with its own tests), or keep lodash for it until last |
| `isEqual` (`lodash/isEqual`) | MultiSelect | the hard one: a deep compare. For the plain arrays and objects it compares, a short `util/isEqual.js`, tested well; or leave lodash for this one |

`times` and `isEqual` are imported by path (`lodash/times`, `lodash/isEqual`), not from `'lodash'`.

## Requirements

- Do it in batches (a handful of components at a time), each with its tests passing before and after, and remove the files you finish from the list in `tests/noMomentLodash.test.js` (the test fails until you do).
- Pay attention to `map` on objects and to `get` with a default: those are where a straight swap changes behaviour.
- When the list is empty: remove the global `_` that `jest.setup.js` provides for legacy files, delete `lodash` from `package.json` (and the lockfile), and the `lodash` line from `docs/features/dependencies.md`.

## Acceptance criteria

- No file imports `lodash`, `lodash/...` or `lodash-es`; `tests/noMomentLodash.test.js` has an empty lodash list.
- The full test suite and the styleguide build pass.
