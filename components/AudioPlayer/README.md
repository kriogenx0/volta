# AudioPlayer

A small player for one audio file: play and pause, elapsed time, a seek bar, the length and an optional mute button.

## When to use

- **One clip or recording on a page**: a voice note, a sample, a track in a list.
- For video use [`VideoPlayer`](../VideoPlayer/README.md).
- It plays a single file. It has no playlist, no next or previous, and no volume slider.

## Usage

```jsx
import { AudioPlayer } from 'volta';

<>
  <AudioPlayer src="/audio/intro.mp3" />
  <AudioPlayer src="/audio/interview.mp3" volume={0.8} waveform="/audio/interview.png" />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `src` | `string` | | Required. URL of the audio file (a data URI works too). A new `src` loads a new file. |
| `autoplay` | `bool` | `false` | Start playing as soon as it loads. Browsers may block this until the page has been clicked. |
| `loop` | `bool` | `false` | Start again at the end instead of stopping. |
| `volume` | `bool` \| `number` | `false` | `false` hides the mute button. `true` shows it. A number from 0 to 1 shows it and sets the starting volume (values outside that range are clamped). |
| `waveform` | `string` | | URL of an image drawn behind the seek bar, for example the track's waveform. |

`autoplay`, `loop` and `volume` are read when the file loads, so changing one afterwards does nothing until `src` changes.

## Variants and states

- **Loading:** a `Loader` (bars) replaces the controls and the root is `aria-busy`.
- **Error:** an empty `src` or a file that fails to load shows "Could not load audio file" with an error icon, as `role="alert"`.
- **Playing:** the play button becomes pause and the bar fills as it plays. At the end it returns to 0:00 (unless `loop`).

## AudioTrack

`AudioTrack` is the old name of `AudioPlayer` (`AudioTrack === AudioPlayer`), kept so existing code keeps working. Use `AudioPlayer` in new code.

## Accessibility

- Play and mute are native buttons: "Play" or "Pause", and "Mute" with `aria-pressed`. Their icons are hidden from assistive tech.
- The seek bar is `role="slider"` named "Seek", with a spoken value like "0:12 of 2:05". It takes focus with Tab; Right and Up move forward 5 seconds, Left and Down back 5, Home goes to the start and End to the end.
- Dragging or tapping the bar seeks with a mouse, finger or pen.
- The waveform is only a background image and carries no text alternative; don't use it to convey information.
- Colours come from the theme tokens, so both themes work.

## Do and don't

- Do give the audio a visible title or caption nearby; the player does not show one.
- Do offer a transcript for speech.
- Don't use `autoplay` with sound; it is blocked by default in most browsers and is jarring where it isn't.
- Don't squeeze it: the buttons and times take at least 150px (200px with the mute button) before the seek bar gets any room.
