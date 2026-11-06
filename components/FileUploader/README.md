# FileUploader

A drag-and-drop or click-to-browse box that shows a file name and upload progress, and tells you which files were chosen.

## When to use

- **Starting an upload with feedback.** The box shows the file name and a progress fill, with an Upload action to start and a cancel action while it runs. It does not upload anything itself: you send the files and feed back `fileName` and `percent`.
- Choosing files with no progress to show is [`FilePicker`](../FilePicker/README.md), which is a real button. An image with a preview is [`ImageDropZone`](../ImageDropZone/README.md) or [`ImagePicker`](../ImagePicker/README.md).

## Usage

```jsx
import { FileUploader } from 'volta';

<FileUploader
  accept="image/*"
  fileName={upload.name}
  percent={upload.percent}
  onChange={startUpload}
  onCancel={cancelUpload}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `onChange` | `function` | | Called with the `FileList` from the dialog or from a drop. Required in practice: choosing a file without it throws. |
| `fileName` | `string` | | The text in the box. While a file is dragged over it shows "Drop Here" or "Drop It!" instead. |
| `percent` | `number` | | Upload progress, 0 to 100, drawn as a fill behind the name. A number means an upload is in progress and shows the cancel action; leave it out (or `null`) when idle. |
| `onCancel` | `function` | | Called when the cancel action is clicked during an upload. |
| `accept` | `string` | | The native `accept` of the file dialog, such as `image/*` or `.pdf`. |
| `allowDragAndDrop` | `bool` | `true` | Turns off the page-wide "Drop Here" cue when `false`. The box itself still accepts a drop. |
| `multiple` | `bool` | | Lets the dialog pick several files. |
| `complete` | `bool` | | Shows the finished state: the progress fill is removed and the box gets its finished background. |

With no `fileName` and no `percent`, an "Upload" action also appears beside the box. The progress fill is the accent colour. It uses Font Awesome class names (`fa fa-...`) for the Upload and cancel icons; the library does not load Font Awesome, so the host page has to.

## Accessibility

- Known gap: the box, the Upload action and the cancel action are `div`s with click handlers. They are not focusable, have no role and do not respond to the keyboard, so a keyboard or screen-reader user cannot start or cancel an upload with this component alone.
- Offer a [`FilePicker`](../FilePicker/README.md) (a real button) next to it, or instead of it, where that matters.
- Progress is shown only by the fill, with no text and no `role="progressbar"`. Show the percentage as text next to it if the number matters.

## Do and don't

- Do pass `fileName` and `percent` from your upload state so the box shows what is happening.
- Do check the chosen files' type and size yourself; `accept` only filters the dialog.
- Don't expect `allowDragAndDrop={false}` to stop the box taking a drop.
- Don't rely on it as the only way to upload for keyboard users.
- Don't set `percent` to a number when idle; use `null` or leave it out, or the cancel action shows.
