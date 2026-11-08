# FileManager

A browser for one folder at a time: a back button, the path to the folder, and its files and subfolders as a list of rows.

## When to use

- **Browsing files that already exist** (on a server, in storage) one level at a time. You hold the current path and load each folder's listing; `FileManager` only shows it and reports clicks.
- Choosing a file from the user's own device is [`FilePicker`](../FilePicker/README.md), or [`FileUploader`](../FileUploader/README.md) when there is upload progress to show.
- A deep tree with expand and collapse is not what this does; it shows a single folder.

## Usage

```jsx
import { FileManager } from 'volta';

<FileManager
  files={['documents/', 'photos/', 'notes.txt']}
  path={path}
  loadingFiles={loading}
  onFileSelect={(name) => (name.endsWith('/') ? openFolder(name) : openFile(name))}
  onPathBack={path.length > 0 ? goUp : undefined}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `files` | `string[]` | | Names in the current folder. A name ending in `/` is a folder (shown without the slash, with a folder icon); anything else is a file. |
| `path` | `string[]` \| `string` | | Folder names from the root down, or one `"a/b/c"` string. Empty or missing shows `/`. It is display only; the path segments are not clickable. |
| `onFileSelect` | `function` | | Called with the name exactly as it is in `files` (a folder keeps its trailing `/`) when a row is clicked. |
| `onPathBack` | `function` | | Called when the back button is clicked. Without it the back button is disabled. |
| `loadingFiles` | `bool` | | Shows a `Loader` instead of the list and sets `aria-busy` on it. |

With no files (or an empty array) the list shows `Empty` with "No files". The list is a fixed 300px tall and scrolls.

## Accessibility

- Each row is a native `<button>`, so Tab reaches it and Enter or Space selects it. Hover highlights the row in the accent colour and keyboard focus draws an outline.
- The back button has the label "Back to the parent folder" and the icons are hidden from assistive technology.
- The path is plain text, not a landmark or a list.
- A folder is marked by its icon only: the row's name for a screen reader is the file name without the trailing slash, so it does not say "folder". If that matters, say it in your own text.

## Do and don't

- Do keep the path in your own state and pass `onPathBack` only when there is a parent to go to.
- Do show `loadingFiles` while a folder loads rather than an empty list.
- Don't forget the trailing `/` on folder names; without it a folder is shown as a file.
- Don't use it to choose an upload; use `FilePicker`.
