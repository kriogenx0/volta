# Lazy

Holds back its children until it is near the screen, so a long page only renders the parts being looked at.

## When to use

- **A long page of heavy parts:** a list of charts, maps, editors or example panels, where rendering all of them at once makes the page slow to open.
- **Content below the fold** that costs something to draw or fetch and is not needed until the user scrolls.
- Don't use it for short pages or for content that must be in the page for search or print; it renders nothing until it is near the screen.
- To show the real component while data loads, use [`Loader`](../Loader/README.md). `Lazy` waits for the screen; `Loader` waits for data.

## Usage

```jsx
import { Lazy, Loader } from 'volta';

<Lazy minHeight={320} placeholder={<Loader size="small" />}>
  <HeavyChart data={data} />
</Lazy>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `node` | | What to render once it is near the screen. Once shown it stays. |
| `placeholder` | `node` | | Shown in place of the children until they load, for example a [`Loader`](../Loader/README.md) or a skeleton. |
| `minHeight` | `number` \| `string` | | Space to keep until the children load, so the page doesn't jump: pixels, or any CSS length. |
| `rootMargin` | `string` | `'400px'` | How far outside the screen counts as near, as a CSS margin. A larger value loads sooner. |
| `load` | `bool` | `false` | Loads now, whether or not it is near the screen. Use it for "jump to this section". |
| `onLoad` | `function` | | Called once, when the children have shown. |
| `as` | element type | `'div'` | The element to render. |
| `className` | `string` | | Added to the wrapper (`volta-lazy`). |

Any other prop goes to the wrapper element.

## Accessibility

- While waiting, the wrapper has `aria-busy="true"`; it is removed when the children show.
- The placeholder is what a screen reader finds until then. Content that must be reachable by headings, find-in-page or a "skip to" link should not be lazy, or should be loaded with `load` when its link is used.
- A placeholder with a spinner should say what is loading; see [`Loader`](../Loader/README.md).
- It adds no focusable elements and no keyboard behaviour.

## Do and don't

- Do set `minHeight` close to the real height, so the scroll bar and the position don't jump when content loads.
- Do set `load` when something outside needs the content now (a link that scrolls to it).
- Don't wrap everything; each `Lazy` watches its own box, so a few large ones beat hundreds of tiny ones.
- Don't put content in that has to stay mounted while off screen (a playing video, a form with unsaved input) unless it has already loaded; it never unloads once shown.
- Don't rely on it for browsers without `IntersectionObserver`; there the children render at once.
