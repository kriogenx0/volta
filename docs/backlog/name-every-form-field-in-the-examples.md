---
priority: p2
components: [ComboBox, DateInput, Field, FieldRow, MultiSelect, Select, TagInput, Textarea, TextField, TimePicker, RichTextTinyMCE]
---

# Give every form field in the examples an accessible name

## Objective

`tests/accessibleNames.test.jsx` checks that every button and link in every styleguide example has an accessible name, and passes. The same check on form fields (inputs, selects, textareas) finds **91 unnamed controls in 39 examples**:

- **Examples that show a bare field**: ComboBox (4 examples), DateInput, FieldRow (3), Select (3), TagInput (3), Textarea (3), TextField (5) and TimePicker (3). A field with no label and no `aria-label` is unreadable to a screen reader, and examples are what people copy.
- **Components that don't give their parts a name**: `TimePicker` renders two inputs (hours and minutes) and names neither; `Field` examples with a visible label still leave the input unnamed because the label isn't linked to it (that part is `link-field-label-hint-error`); `MultiSelect` disabled has an unnamed combobox input; `RichTextTinyMCE` renders a hidden textarea with no name.
- **Third-party widgets** (Quill's toolbar, react-select's remove control) are left out of the check, and can't be fixed from here.

## Requirements

- Each example that shows a field gives it a label (a visible `Field`/label, or an `aria-label`), so the example models the right use.
- Components that render several inputs name each part (for example `TimePicker`: "Hours", "Minutes"), and pass an `aria-label` / `aria-labelledby` from the caller to the real input where they don't already.
- Extend `tests/accessibleNames.test.jsx` to form fields (`input:not([type=hidden])`, `select`, `textarea`, and the checkbox, radio and switch roles), with the same third-party exceptions, so it stays true.

## Acceptance criteria

- The extended test passes, and fails for a field with no name.
- Do `link-field-label-hint-error` first or together, since it fixes the `Field` cases at the source.
