# ImageCrop

A full-screen cropper: drag and scale an image inside a fixed frame, then save the framed area as a JPEG.

## When to use

- **Cropping a chosen image to an exact size** (an avatar, a cover photo) before it is uploaded. Most screens want [`ImageUploader`](../ImageUploader/README.md), which opens the file dialog, shows `ImageCrop` in a [`Layer`](../Layer/README.md) and hands back the result. Use `ImageCrop` directly when you already have the `File` or `Blob`.
- Choosing an image with no cropping is [`ImagePicker`](../ImagePicker/README.md) or [`ImageDropZone`](../ImageDropZone/README.md).

## Usage

```jsx
import { ImageCrop } from 'volta';

<ImageCrop
  image={file}
  width={400}
  height={300}
  showScale
  onCrop={(blob) => upload(blob, blob.filename)}
  onClose={() => setFile(null)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `image` | `Blob` | | Required. The `File` or `Blob` to crop. |
| `width` | `number` | `300` | Width in pixels of the frame and of the saved image. |
| `height` | `number` | `300` | Height in pixels of the frame and of the saved image. |
| `bleedWidth` | `number` | `0` | Width of the dimmed border drawn around the frame. Display only. |
| `showScale` | `bool` | `false` | Shows the scale slider between the two size icons. The two size buttons are always there. |
| `onCrop` | `function` | | Called with the cropped image as a JPEG `Blob` (quality 0.95, white behind transparent areas). It also has a `filename`: the original name ending in `.jpg`. |
| `onClose` | `function` | | Called about 200ms after the cropper starts fading out, for both Cancel (or the close button) and "Crop and Save". |

It is a class component. It shows itself while mounted, so you open it by rendering it and close it by removing it in `onClose`. While mounted it adds the classes `bdy` and `is_overlay-visible` to `<body>`, which stops the page behind from scrolling.

## Accessibility

- The cropper has `role="dialog"`, `aria-modal="true"` and the name "Position and size image". The close button, Cancel and "Crop and Save" are real buttons, and the slider is named "Scale".
- Moving the image is by mouse drag only (it listens to mouse events, not keyboard or touch). Keyboard users can centre the image, show it at original size and zoom with the slider, but cannot pan it.
- It does not move focus into the dialog, trap focus or close on Escape. Manage focus where you render it, and return it to the control that opened it.
- The buttons that centre and show the original size have labels and tooltips; the preview image has the alt text "Image being cropped".

## Do and don't

- Do choose `width` and `height` as the exact size you need; the output is always that size.
- Do render it in a `Layer` or at the top of the page, since it is `position: fixed` and an ancestor that clips or transforms could trap it.
- Don't use it on a touch-only layout without testing: panning needs a mouse.
- Don't keep rendering it after `onClose`; unmount it so the page can scroll again.
- Don't expect other output types; the result is always a JPEG.
