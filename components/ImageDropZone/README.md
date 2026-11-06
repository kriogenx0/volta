# ImageDropZone

A single button-sized box that shows an image and takes a new one on a click or a drop.

## When to use

- **Choosing one image with a preview** where dragging a file onto the box is a convenience: a cover image, a logo.
- An image that has a remove button, or that is chosen through a native file input, is [`ImagePicker`](../ImagePicker/README.md). Cropping to an exact size is [`ImageUploader`](../ImageUploader/README.md). Any file type, or a list of files, is [`FilePicker`](../FilePicker/README.md) or [`FileUploader`](../FileUploader/README.md).

## Usage

```jsx
import { ImageDropZone } from 'volta';

<ImageDropZone
  height={240}
  defaultImageUrl={user.coverUrl}
  onChange={(file, dataUrl) => setCover(file)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `onChange` | `function` | no-op | Called with the chosen `File` and its data URL once the file has been read. |
| `defaultImageUrl` | `string` | `null` | An image to show until one is chosen. If it arrives later it is shown, unless the user has already chosen a file. |
| `height` | `number` | `300` | Height of the box in pixels. It is always as wide as its container. |
| `selectFileOnMount` | `bool` | `false` | Opens the file dialog as soon as the zone mounts. Browsers may ignore it without a recent click. |
| `className` | `string` | `null` | Added to the button. |

The picture fills the box as a cover background. With no picture the box shows "Click or drop an image". The file dialog is limited to images (`image/*`), and a dropped file that is not an image is ignored. There is no way to clear a chosen image.

## Variants and states

Resting, it has a dashed border. On hover, and while a file is dragged over it, the border turns the accent colour and the box takes `--v-accent-subtle`. Keyboard focus draws an accent outline.

## Accessibility

- The whole zone is one native `<button>`, so Tab reaches it and Enter or Space opens the file dialog. Dropping a file is an extra, never the only way.
- With an image chosen, the button is named "Change image". With none, its name is the hint text "Click or drop an image".
- The picture is a CSS background, so it has no alt text and the button does not describe it. Say what the image is in surrounding text if that matters.

## Do and don't

- Do keep the chosen `File` from `onChange` and upload it yourself; the component only reads it.
- Do set a `height` that suits the image's usual shape.
- Don't use it where the user needs to remove or replace many images; it has no remove action.
- Don't set the border or hover colour with `className`; they come from the theme tokens.
- Don't rely on `selectFileOnMount` for a flow that has to work; browsers often block it.
