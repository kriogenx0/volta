# Form fields: label, hint and error

A form control needs three things connected to it for a screen reader: the label that names it, a hint that helps, and an error that says what is wrong. `Field`, `FieldRow`, `TextBox`, `NativeSelect`, `Toggle` and `Checkbox` connect them.

## What it does for users

- **The label is a real `<label>`** that points at the control (`for` / `id`), so a screen reader reads it, and clicking it focuses the control.
- **A hint** (`hint`) shows under the control in muted text and is read as the control's *description* (`aria-describedby`).
- **An error** (`error`) shows under the control in the error style, is read as part of the description, and marks the control `aria-invalid="true"`. A TextBox and a Select also get the red border.
- **With several controls in one Field**, they can't share an id, so the label names the *group* (`role="group"` with `aria-labelledby`), and the hint and error describe the group. Each control keeps its own name (`aria-label`).

## Using it

```jsx
<Field label="Email" hint="Use your work address" error={emailError}>
  <TextBox type="email" />
</Field>

<Field label="Date of birth" hint="As on your passport">   {/* a group */}
  <TextBox aria-label="Day" />
  <TextBox aria-label="Month" />
</Field>

<TextBox label="Email" hint="Use your work address" />   {/* a field of its own */}
<NativeSelect label="City" error="Choose a city" options={cities} />
```

- **`Field` and `FieldRow`** take `label`, `hint`, `error`, and `htmlFor`. With one child, the label points at that child's own `id` if it has one (so a native `<input id="x">` works as it is), and otherwise at an id the Field makes and hands to the control. `htmlFor` names a control that isn't a direct child.
- **`TextBox` (also `TextField` and `Textarea`) and `NativeSelect`** take `label`, `hint` and `error` themselves, and inside a Field take the Field's id, hint and error as well. `Toggle` and `Checkbox` take the Field's id, hint and error (a Checkbox keeps its own label text, so its name is the Field's label followed by it).
- **`FieldHint`** is the hint element, for building a field by hand: give it an `id` and point the control's `aria-describedby` at it.
- A control's own `id`, `aria-describedby` and `aria-invalid` win; its `aria-describedby` is kept and the hint and error ids are added after it.

## How it works

`Field` and `FieldRow` provide a context (`components/Field/fieldContext.js`) with the control's id, the hint and error ids, and whether there is an error; a control calls `useFieldControl` to merge that into its own input attributes. The context is provided only when there is exactly one child, so two controls never share an id. Outside a Field the hook returns the control's own props, unchanged.

## Tests

`tests/Field/`, `tests/FieldRow/`, `tests/FieldHint/` and `tests/NativeSelect/NativeSelectFieldLinks.test.jsx` check names and descriptions the way a browser computes them (`toHaveAccessibleName`, `toHaveAccessibleDescription`), validity, the group case, the control's own id, and that nothing leaks outside the Field. Disconnecting the context fails 13 of them.

## Known limits

- **Only controls that use the hook are connected.** A native `<input>` as the direct child is linked by its `id`, but does not get the hint and error ids; give it `aria-describedby` yourself. Other Volta controls (ComboBox, DateInput, TimePicker, TagInput, MultiSelect) do not take part yet.
- A Field with several controls is a group, so its label can't focus a control when clicked.
- Examples that show a bare field with no label still exist; they are listed in `docs/backlog/name-every-form-field-in-the-examples.md` if that task has been merged.
- Not checked with a screen reader; names and descriptions are computed by `dom-accessibility-api`, which follows the algorithm but is not a browser.

## History

- 2026-11-05 (branch `backlog/link-field-label-hint-error`, not merged or deployed): `Field` and `FieldRow` labels became real `<label>`s linked to their control, with `hint` and `error` support; `FieldHint` added; `TextField`, `NativeSelect`, `Toggle` and `Checkbox` join the mechanism. (`FormField` named in the task does not exist in this repo.)
- Not verified in a browser: the look of the new hint and error under each control, and `<label>` replacing the old `<div>`s in the `Field` and `FieldRow` layouts at desktop and mobile widths.
- 2026-11-10 (local, not merged or deployed): `TextBox` is the text input; `TextField` and `Textarea` are other names for it (`multiline`, `resize`, `height`), and `NumericField` is built on it. `DateInput` became a plain alias exported from `DatePicker`. A `Field` or `FieldRow` also accepts `FieldLabel`, `FieldHint` and (in a `Field`) `FieldRow` as direct children.
