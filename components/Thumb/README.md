# Thumb

A small square thumbnail of an image, with a placeholder icon when there is no image.

## When to use

- **A small preview next to a name or in a list or table row:** a product, a file, a video.
- Use [`Avatar`](../Avatar/README.md) for a person or account, [`ImagePicker`](../ImagePicker/README.md) or [`ImageUploader`](../ImageUploader/README.md) when the user chooses or uploads the image, and [`Icon`](../Icon/README.md) for a glyph rather than a picture.
- It is not interactive. To open the full image, wrap it in a [`Link`](../Link/README.md) of your own.

## Usage

```jsx
import { Thumb } from 'volta';

<>
  <Thumb src="/images/lamp.jpg" alt="Brass desk lamp" />
  <Thumb alt="No image available" size={40} />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `src` | `string` | | The image URL. Without it, the placeholder icon is drawn instead. |
| `alt` | `string` | | Required. The image's alternative text. |
| `size` | `number` | `56` | Width and height in pixels. The image is cropped to fill the square (`object-fit: cover`). |

The thumbnail has rounded corners and keeps its size in a flex row (it won't shrink). The placeholder is a bordered box with an image icon in `--v-color-trim-less-subtle`.

## Accessibility

- With `src`, it is an `<img>` whose `alt` is the accessible name. Describe what the picture shows ("Brass desk lamp"), not "thumbnail".
- If the thumbnail only repeats text beside it, pass `alt=""` so a screen reader skips it.
- The placeholder is a `div` with an unlabelled icon: `alt` is not used and it has no role or name. Don't rely on it to say that an image is missing; say so in text.

## Do and don't

- Do give every thumbnail the same `size` within a list, so rows line up.
- Do pick a `size` that is still recognisable on a 375px screen.
- Don't make it the only way to identify an item; add the name as text.
- Don't stretch it with CSS; change `size`, so the crop stays square.
- Don't use it for large images; load a small version of the file for a small thumbnail.
