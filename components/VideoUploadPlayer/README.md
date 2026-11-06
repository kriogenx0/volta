# VideoUploadPlayer

A drop-or-click box for choosing a video file, with a progress fill while it uploads and a player to preview the result.

## When to use

- **Choosing one video to upload and previewing it:** a lesson video, a profile intro. Your code does the upload and feeds back progress and the URL.
- Use [`FileUploader`](../FileUploader/README.md) or [`FilePicker`](../FilePicker/README.md) for files that aren't video, [`ImageUploader`](../ImageUploader/README.md) for pictures, and [`VideoPlayer`](../VideoPlayer/README.md) alone to show a video without uploading.
- It does not upload anything. It reports the chosen files with `onChange`; you send them and update `percent`, `complete`, `fileName` and `url`.

## Usage

```jsx
import { VideoUploadPlayer } from 'volta';

<VideoUploadPlayer
  fileName={file && file.name}
  percent={percent}
  complete={done}
  url={videoUrl}
  onChange={(files) => startUpload(files[0])}
  onCancel={cancelUpload}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `onChange` | `function` | | Called with the `FileList` when files are chosen or dropped. Required in practice: the component calls it without checking. |
| `onCancel` | `function` | | Called when the box is clicked while an upload is in progress. Needed whenever you pass `percent`. |
| `percent` | `number` | | Upload progress, 0 to 100. Any number, including 0, means "in progress": the box shows a fill of that width and a click cancels. Leave it undefined or null when idle. |
| `complete` | `bool` | | The upload is done: the progress fill is hidden and the box gets a muted background. |
| `fileName` | `string` | | The box's label. Without it the label is "Upload". |
| `url` | `string` | | A video to preview. When set, a `VideoPlayer` appears above the box and the box shrinks to a slim bar. |
| `multiple` | `bool` | | Lets the file chooser select several files. |
| `allowDragAndDrop` | `bool` | `true` | Listens for files dragged anywhere on the page, so the box can say "Drop Here". |

The chooser only offers video files (`video/*`). The label changes to "Drop Here" when a file is dragged over the page and "Drop It!" over the box itself. Dropping onto the box calls `onChange` whether or not `allowDragAndDrop` is set; that prop only controls the page-wide drag listeners.

## Accessibility

- The box is a `div` with a click handler: it has no role, no `tabindex` and no key handler, so keyboard and screen-reader users can't choose a file or cancel an upload with it. Provide another way to reach the same action, such as a visible [`Button`](../Button/README.md) that opens your own file input.
- Progress is a coloured fill with no `progressbar` role; show the percentage as text (the label or beside the box).
- The preview is a [`VideoPlayer`](../VideoPlayer/README.md) with no `controls` and no way to pass props to it, so it autoplays (VideoPlayer's default), a click plays or pauses it, and it has no accessible name.

## Do and don't

- Do validate the file (type and size) in `onChange` before uploading, and show an error when it fails.
- Do set `complete` and update `fileName` when the upload ends, so the box reflects what happened.
- Don't pass `percent` without `onCancel`; a click during an upload would throw.
- Don't rely on drag and drop alone; it doesn't exist on touch screens, where the box opens the chooser on tap.
- Don't use it for large uploads without showing progress text and a way to retry.
