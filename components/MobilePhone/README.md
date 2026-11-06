# MobilePhone

A phone-shaped frame that shows a screen of your app inside it, for previews and demos.

## When to use

- **Previewing how something looks on a phone**, such as a mobile layout or a message, next to the settings or editor that produces it.
- It is a picture frame, not a device emulator. The content is laid out in a fixed 320px-wide screen (at least 480px tall, growing with its content); it does not respond to the page width and does not change the page's own breakpoints.
- Use [`Card`](../Card/README.md) when you only need a bordered container, and the real page at a narrow width for responsive testing.

## Usage

```jsx
import { MobilePhone } from 'volta';

<MobilePhone>
  <h2>Welcome back</h2>
  <p>Your order has shipped.</p>
</MobilePhone>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `node` | | The screen shown inside the phone. |

The frame has a speaker slot, a status bar and a home button, all decoration. The status bar clock shows the current time in 12-hour form (midnight and noon read `12:xx`), read when the component renders, so it does not tick.

## Accessibility

- The speaker, clock and home button are hidden from screen readers (`aria-hidden`), so only your content is read.
- The screen area is not a landmark and has no label. Whatever you put in it keeps its own roles, focus order and keyboard behaviour.
- The screen is a fixed 320px wide and clips content that is wider. The frame is a fixed width, so on a narrow page it can be wider than the space it is given; check it at mobile width.

## Do and don't

- Do put a mobile-sized layout inside it; design for a 320px-wide screen.
- Do use it for previews users look at, not for navigation or controls that matter to the page.
- Don't put the whole page in a `MobilePhone` on a small screen; the frame uses up the width.
- Don't expect media queries inside it to see a 320px screen; they still follow the browser window.
- Don't rely on the status bar clock for the time; it is decoration.
