---
priority: p3
branch: backlog/consolidate-duplicate-components
---

# Consolidate duplicate components

The task asked to "decide and keep one of each" and says the choices change the public API, so they need your confirmation. Nothing has been consolidated. What follows is what the code says today, because several of the pairs in the original task no longer match it, and a recommendation for each.

## What is true now

| The task named | What is there | Recommendation |
| --- | --- | --- |
| `Field` vs `FormField` | There is no `FormField` anywhere (`grep -rn FormField components examples styleguide tests` finds nothing). Only `Field` and `FieldRow` exist, and they do different jobs (a label above a control, and a label beside it). | Nothing to consolidate. Drop this pair. |
| `DatePicker` vs `DateInput` vs `DateTime` | `DateInput` is a one-line re-export of `DatePicker` (`components/DateInput/DateInput.jsx`: "retained as a compatibility name"). There is no `DateTime` component. | Already consolidated, by the alias convention below. Nothing to do unless you want the alias gone. |
| `CloseButton/index.js` vs `index.jsx` | One `index.js` now: an earlier pass removed the duplicate. | Done. |
| `CheckboxGroup/index.jsx`, `Field/index.jsx` | Not duplicates: each folder has a single `index.jsx` that only re-exports the component. 51 folders use `index.js`; three use `index.jsx`: `CheckboxGroup`, `Field`, `RadioGroup`. | A naming inconsistency, not a duplicate. Rename the three to `index.js` (nothing imports the extension, so it is not a break). Safe, and can be done without waiting for you. |
| `Modal` vs `ModalDialog` vs `Dialog` | The real overlap. See below. | Needs your decision. |

## Modal, ModalDialog and Dialog

`Modal` is the primitive: a backdrop and a centred panel, either titled with a close button or wrapping your own content. `ModalDialog` and `Dialog` are the same thing twice: a header with a title, a body, and two buttons.

| | `ModalDialog` | `Dialog` |
| --- | --- | --- |
| built on | `Modal` | `PopOver` |
| open with | `isOpen` | `isOpen` |
| confirm / cancel callbacks | `onOkay`, `onCancel` | `handleSave`, `handleClose` |
| button labels | `okayButtonLabel`, `cancelButtonLabel` | `titleSave`, `titleCancel` |
| confirm disabled / hidden | `okayEnabled`, `hideOkayButton` | `saveEnabled`, `hideSaveButton` |
| close "x" | `closeX` (off by default) | always, when there is a title |
| close on a click outside and Escape | `closeOnOverlayClick`, **on** by default | `closeOnOverlayClick`, **off** by default |
| in the page flow | `inlineMode` | `inlineMode` |

Inside this repository nothing uses either of them (`ModalDialog` is the only user of `Modal`; `SearchSelector` and `Dialog` use `PopOver`), so both are public API for consumers outside it.

Options:

- **Keep both, as one implementation.** Make `Dialog` a thin wrapper over `ModalDialog` that maps its props (`handleSave` to `onOkay`, `titleSave` to `okayButtonLabel`, and so on), the way `TextBox` wraps `TextField` and `DateInput` re-exports `DatePicker`. Nobody breaks, and there is one dialog to maintain. The catch: the two have different defaults (`closeOnOverlayClick`, whether the close "x" shows) and different bases (`PopOver` draws its backdrop as a separate element), so the wrapper has to keep each default, and the look changes slightly for `Dialog` users.
- **Keep one, remove the other.** Cleaner, a breaking change for whoever uses the one that goes.
- **Leave it.** They work; the cost is two dialogs to keep in step.

My recommendation is the first. It is the convention this repository already uses, and it removes the duplication without breaking anyone.

## Blocked

Waiting on you to pick one of the above for the dialogs (and to say whether the `index.jsx` rename should go ahead; it doesn't need a decision). Everything else in the original task is either already true or doesn't exist.

To finish: do what you choose, add tests that pin each prop and default of the surviving public names (both dialogs have thorough tests already: `tests/Dialog`, `tests/ModalDialog`, `tests/Overlay/modalBehavior.test.jsx`), update `docs/features/overlays.md` if it is on `main` by then, and delete this file.
