# VideoPlayer

An HTML5 `<video>` that plays or pauses when clicked, with a no-video icon when there is no source or it fails to load.

## When to use

- **Playing one video** from a URL, inline in a page: a lesson, a recording, a preview.
- Use [`AudioTrack`](../AudioTrack/README.md) for sound only, [`VideoUploadPlayer`](../VideoUploadPlayer/README.md) when the user also uploads the file, and [`Thumb`](../Thumb/README.md) for a still image.
- It fills the width of its container. There is no playlist, no captions input and no custom control bar: add the `controls` prop for the browser's.

## Usage

```jsx
import { VideoPlayer } from 'volta';

<VideoPlayer
  src="/media/intro.mp4"
  type="video/mp4"
  poster="/media/intro.jpg"
  controls
  muted
  autoPlay={false}
  aria-label="Product introduction"
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `src` | `string` | | The video URL, drawn as a `<source>`. Empty, no `<source>` is drawn and the no-video icon shows. A new `src` remounts the video. |
| `type` | `string` | | The MIME type of the source, such as `video/mp4`. |
| `poster` | `string` | | An image shown before the video plays. Left off the element when empty. |
| `failTimeout` | `number` | `1000` | Milliseconds to wait for the video to start loading before it counts as failed. |
| `onLoadEvent` | `function` | | Called with `(eventType, event, status)` on `loadstart`, `loadeddata` and `error`, and `failed` when `failTimeout` runs out (then `event` is just `{ type: 'failed' }`). `status` is `'success'`, `'failed'` or `null`. |
| `className` | `string` | | Added to the wrapper `div`. |

Every other prop goes to the `<video>`: `controls`, `muted`, `loop`, `autoPlay`, `preload`, `aria-*`. `autoPlay` is on unless you pass `autoPlay={false}`, and browsers usually only autoplay muted video. Without `controls`, a click or Enter or Space plays or pauses it, and a click also turns on `loop`. A video that has failed ignores clicks. A failure is also logged with `console.warn`.

## Accessibility

- With `controls` the browser's own controls do the work and are keyboard and screen-reader accessible. Without them the video takes `tabindex="0"` and responds to Enter and Space, but has no role or name: pass `aria-label`.
- Prefer `controls`: the click-only mode shows no play state, volume or progress.
- The component draws no `<track>`, and its children are fixed, so it has no way to add captions or a transcript. Provide a transcript beside it for any video with speech.
- Failure is shown by an icon only. If the video matters, also show text from `onLoadEvent` when `status` is `'failed'`.

## Do and don't

- Do set `type` so the browser can pick a supported format, and `poster` so there is something to see before play.
- Do pass `muted` if it autoplays, or `autoPlay={false}`.
- Don't autoplay with sound or without a way to pause it.
- Don't leave `aria-label` off a video without `controls`.
- Don't restyle the border or icon; they come from the theme tokens, in light and dark.
