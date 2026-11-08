# FilePicker

A button that opens the browser's file dialog and lists the chosen files with a remove button for each.

## When to use

- **Choosing one or several files from the user's device** in a form, when you do the upload yourself afterwards and don't need a drop area or a progress bar.
- A drop area with upload progress is [`FileUploader`](../FileUploader/README.md). Choosing and previewing an image is [`ImagePicker`](../ImagePicker/README.md) or [`ImageDropZone`](../ImageDropZone/README.md); cropping it as well is [`ImageUploader`](../ImageUploader/README.md).
- Browsing files that already exist on a server is [`FileManager`](../FileManager/README.md).

## Usage

```jsx
import { FilePicker } from 'volta';

<>
  <FilePicker fileType="image" buttonLabel="Choose image" onChange={handleFiles} />
  <FilePicker multiple defaultValue="report.pdf" onChange={handleFiles} />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `onChange` | `function` | no-op | Called with the current list of files after every pick and every removal. |
| `multiple` | `bool` | `false` | Allows several files and appends each pick to the list. Without it a pick replaces the file. |
| `fileType` | `string` | `null` | `'image'` or `'audio'` limits the dialog to `image/*` or `audio/*`. Any other value does not filter. |
| `buttonLabel` | `string` | | The button text. Without it: "Select File", or "Change File" once a single file is chosen. |
| `defaultValue` | `string` \| `object` \| `array` | `null` | Files to show at the start: a file name, a `{ name, typeClass }` object, or an array of either. Names are shown only; there is no File behind them. Read again whenever it changes. |
| `className` | `string` | `null` | Added to the root element. |

The picker keeps its own list; it is not controlled. The dialog is opened with a temporary `<input type="file">` that is not in the page.

## Accessibility

- The select button is a real `Button` with a text label, so Tab and Enter or Space work.
- The remove button for each file shows only an icon and has no `aria-label`, so a screen reader announces it with no name. Known gap: until it is fixed, tell users how to remove a file in your own text.
- The file icons are not hidden from assistive technology and carry no text; the file name beside each is the real content.
- The chosen files are listed as text, so what was picked is not conveyed by icon or colour alone.

## Do and don't

- Do set `fileType` when only images or audio make sense, so the dialog filters for the user.
- Do check the type and size of each file yourself; `fileType` only filters the dialog.
- Don't use it for a drag-and-drop area; that is `FileUploader`.
- Don't use it for a single image with a preview; use `ImagePicker`.
- Don't pass a new array as `defaultValue` on every render: it is read again whenever it changes, and that would reset the list.
