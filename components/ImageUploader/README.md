# ImageUploader

Wraps any element so that clicking it chooses an image, crops it to an exact size and hands you the result.

## When to use

- **An avatar, cover or logo that must be an exact size.** The user clicks your trigger (a button, an avatar, a placeholder), picks an image, drags and scales it in a frame, and you get the cropped JPEG.
- Choosing an image with no crop is [`ImagePicker`](../ImagePicker/README.md) or [`ImageDropZone`](../ImageDropZone/README.md). The cropper alone, when you already hold the file, is [`ImageCrop`](../ImageCrop/README.md).

## Usage

```jsx
import { ImageUploader, Button } from 'volta';

<ImageUploader cropWidth={400} cropHeight={400} onImagePick={(blob) => upload(blob, blob.filename)}>
  <Button>Choose photo</Button>
</ImageUploader>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `cropWidth` | `number` | | Required. Width in pixels of the cropped image. |
| `cropHeight` | `number` | | Required. Height in pixels of the cropped image. |
| `onImagePick` | `function` | | Required. Called with `(blob, url)`: the cropped JPEG `Blob` (it has a `filename`) and an object URL for it. |
| `children` | `node` | | What to click to start: a button, an avatar, a placeholder. |
| `shouldPick` | `bool` | | When it turns `true` the file dialog opens, with no click on the children. Set it back to `false` to be able to trigger it again. |
| `bleedWidth` | `number` | | Width of the dimmed border around the crop frame, passed to `ImageCrop` (its default is `0`). |
| `className` | `string` | | Added to the wrapper around the children. |

The dialog accepts images only. After a choice the cropper opens full screen (in a `Layer`) with the scale slider on. Cancel or the close button ends it without calling `onImagePick`. The `url` is revoked as soon as the image has loaded, so don't keep it; make your own with `URL.createObjectURL(blob)` for a preview, and revoke that yourself.

## Accessibility

- The children are wrapped in a plain `div` with a click handler, which is not focusable and has no role. Put a native control inside, such as a `Button`: a keypress on it becomes a click that reaches the wrapper, so keyboard users can start it.
- Give the trigger text or an `aria-label` that says what it does ("Choose photo").
- The cropper is a labelled dialog but has limits for keyboard and touch users; see [`ImageCrop`](../ImageCrop/README.md).

## Do and don't

- Do set `cropWidth` and `cropHeight` to the size you will store; the output is exactly that size.
- Do upload the `Blob` and show your own preview rather than relying on `url`.
- Don't pass a bare `<img>` or `<span>` as the only child; it can't be reached by keyboard.
- Don't leave `shouldPick` set to `true`; reset it after each use.
- Don't expect other formats; the result is a JPEG.
