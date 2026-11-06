# Accessible names

A control that shows only an icon has no text for a screen reader to read, so it needs a name. This is about buttons, links and similar controls; form fields take their name from a label (see below).

## What is enforced

`tests/accessibleNames.test.jsx` renders every styleguide example and fails for any `button`, `a[href]`, or element with role `button`, `link`, `menuitem`, `tab` or `option` whose accessible name (computed the way a browser does) is empty. It fails when a component stops labelling its icon-only control: removing `IconButton`'s label fails 6 examples. Controls inside an `aria-hidden` element are skipped, and so are two third-party widgets this library can't label: Quill's toolbar and react-select's remove-value control in `MultiSelect`.

## The icon-only controls

- `IconButton`: `label` is required (it becomes the `aria-label` and the tooltip).
- `CloseButton`: `aria-label`, defaulting to "Close"; pass your own to say what it closes.
- `ActionMenu`'s trigger: `aria-label`, defaulting to "Actions"; pass "Row actions" or similar to say what the menu is for. (The label used to be fixed.)

## Form fields

Not covered by that test yet. Checking the same way finds 91 unnamed fields in 39 examples, mostly examples that show a field with no label, plus a few components that don't name their parts (`TimePicker`'s two inputs, for one). Tracked in `docs/backlog/name-every-form-field-in-the-examples.md`.

## History

- 2026-11-05 (branch `backlog/require-aria-label-on-icon-buttons`, not merged or deployed): the check added; `ActionMenu` takes `aria-label`. `CloseButton` and `IconButton` already did.
- Not verified with a screen reader; the names are computed by `dom-accessibility-api`, which follows the accessible name algorithm but is not a browser.
