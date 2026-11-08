---
priority: p2
components: [Field, FieldRow, FieldHint, TextField, Select, Toggle, Checkbox]
branch: backlog/link-field-label-hint-error
---

# Check the Field and FieldRow layouts in a real browser

Done on the branch above (see `docs/features/form_fields.md`): the label of `Field` and `FieldRow` is a real `<label>` pointing at the control, with `hint` and `error` supported and read as the control's description; `TextField`, `Textarea`, `Select`, `Toggle` and `Checkbox` join in; the new `FieldHint` shows the hint. (`FormField`, named in the task, does not exist in this repo.) Names, descriptions and validity are covered by tests.

## Unverified

The label used to be a `<div>` and is now a `<label>`, with `display: block` added to keep the layout. The new hint and error styles were not looked at. In the styleguide (`make dev`), on the Field, FieldRow, TextField, Select and FieldHint pages:

1. **Layout unchanged**: `Field` (including `type="split"`, where the label floats left at 140px and drops above the control under 640px) and `FieldRow` (label on the left at 25%, stacked on mobile) look as they did before.
2. **Hint and error**: the hint is small muted text 4px under the control; the error shows in the error style under it (and under the hint, when both); a TextField or Select with an error has the red border.
3. **Clicking the label focuses the control** (a browser does this; the tests can only check that the label points at it).
4. Light and dark, at desktop and 375px.
5. If you have one, a screen reader: the field is announced with its label, then its hint and error.

If anything is off, fix the stylesheet or record a task; otherwise delete this file.

## Related

`name-every-form-field-in-the-examples` (if merged) covers the controls this does not reach yet: ComboBox, DateInput, TimePicker, TagInput, MultiSelect.
