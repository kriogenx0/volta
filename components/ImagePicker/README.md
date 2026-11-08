# ImagePicker

A box with a transparent file input over it that shows the chosen image, with a button to remove it.

## When to use

- **Choosing one image with a preview and a way to clear it**: a profile picture or banner in a form.
- A box that also takes a dropped file, with no remove button, is [`ImageDropZone`](../ImageDropZone/README.md). Cropping to a set size is [`ImageUploader`](../ImageUploader/README.md). Any file type is [`FilePicker`](../FilePicker/README.md).

## Usage

```jsx
import { ImagePicker } from 'volta';

<ImagePicker
  height={200}
  defaultImageUrl={user.avatarUrl}
  accept="image/png, image/jpeg"
  onChange={(file) => setAvatar(file)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `onChange` | `function` | no-op | Called with the chosen `File`, or `null` when the image is removed. |
| `defaultImageUrl` | `string` \| `object` | `null` | An image URL or data URI, or a `File` or `Blob`, shown until the user picks one. |
| `accept` | `string` | `'image/*'` | Passed to the file input's `accept`. |
| `height` | `number` | `300` | Height of the box in pixels. |
| `className` | `string` | `null` | Added to the root element. |

The chosen image is read into a data URL and shown as a cover background; a spinner shows while it reads. Only one file can be chosen. The remove button appears only while there is an image, and it also clears the input so the same file can be picked again. The icons (upload, spinner, trash) use Font Awesome class names (`fa fa-...`); the library does not load Font Awesome, so the host page has to.

## Accessibility

- The file input has `aria-label="Choose an image"` and the remove button has `aria-label="Remove image"`; both are native controls reachable by Tab.
- Known gap: the input is invisible (opacity 0, covering the box) and the stylesheet gives it no focus style, so a keyboard user cannot see when it has focus. The remove button does have a focus outline.
- The picture is a CSS background with no alt text. Describe what it is in nearby text if that matters.
- Spinner and upload icons are hidden from assistive technology.

## Do and don't

- Do handle `null` in `onChange`: it means the image was removed.
- Do set `accept` when only some image types are allowed, and check the file yourself too.
- Don't use it for several images; it takes one.
- Don't keep the box tiny; the whole box is the click target, so give it room on a phone.
- Don't use the library's old `c-image_picker` class in new code; it is kept for an older app's view styles.
