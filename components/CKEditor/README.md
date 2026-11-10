# CKEditor

A click-to-edit text field: it shows the text as a paragraph, and clicking it opens an editor.

## When to use

- **Click-to-edit text with CKEditor 4 behind it**, when the page already loads CKEditor 4 and nothing needs the edited text back yet.
- For rich text in a form that must read the value back, use [`RichTextTinyMCE`](../RichTextTinyMCE/README.md) or [`RichTextQuill`](../RichTextQuill/README.md); they take `value` and `onChange`. To rename a single line in place use [`TextEditable`](../TextEditable/README.md), and for a plain multi-line field in a form [`Textarea`](../TextBox/README.md).
- This component has no `onChange` and no way to read the edited text from a parent. See Behaviour.

## Usage

```jsx
import { CKEditor } from 'volta';

<CKEditor fieldName="description" fieldValue="Hello%20world" placeholder="Add a description" />;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `fieldName` | `string` | `'editor'` | The `name` of the editor's textarea, and the id CKEditor 4 is attached to. Also the textarea's `aria-label`, so name it something a person can read. |
| `fieldValue` | `string` | `''` | The starting text, escaped as JavaScript's `escape()` would produce it (`Hello%20world`). |
| `placeholder` | `string` | `'Click to edit'` | Shown in place of the text while it is empty. |

## Behaviour

- Not editing: a paragraph with the text, or the placeholder when the text is empty. Click, Enter or Space starts editing.
- Editing: if the page provides CKEditor 4 as the global `CKEDITOR` (it is not bundled with Volta), the editor opens with the `Basic` toolbar, 870px wide and 150px high. Without it, a plain textarea opens and takes focus.
- Leaving the editor (blur) saves the text back into the component and returns to the paragraph.
- The text lives only inside the component. It does not call back and renders no form field while it is not editing, so a parent cannot read or submit it.

## Accessibility

- The paragraph is `role="button"` with `tabIndex={0}`, so it is reachable by Tab and starts editing with Enter or Space.
- The plain textarea is labelled with `fieldName`.
- The CKEditor 4 editor is a fixed 870px wide and the fallback textarea is 100 columns, so neither fits a phone screen without scrolling sideways.
- The component has no stylesheet (`volta-ckeditor`, `volta-ckeditor--empty` and `description_field` are only hooks), so the paragraph and the textarea look like plain browser defaults: no pointer cursor, no hover state and no focus ring of its own.

## Do and don't

- Do pass `fieldValue` already escaped, and a readable `fieldName`.
- Do load CKEditor 4 on the page before using the rich editor, or accept the plain textarea.
- Don't use it for a form field whose value you need; use a rich text component that has `onChange`.
- Don't use it on a phone-width layout until the editor width is changed.
- Don't expect it to match the theme; style the hooks above in the page if it has to blend in.
- Don't expect the text to be saved anywhere; the component never sends it.
