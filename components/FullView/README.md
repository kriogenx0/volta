# FullView

A scrolling container that is sized to fill the window from its own top edge down to the bottom of the viewport.

## When to use

- **The main area under a header or toolbar** that should fill the rest of the window and scroll inside itself, so the page does not scroll.
- A main area beside a collapsible side pane is [`SplitView`](../SplitView/README.md), which has the same height behaviour. A column of content with a maximum width is [`PageWidth`](../PageWidth/README.md).
- Content that should flow with the page and scroll the whole window needs no container.

## Usage

```jsx
import { FullView } from 'volta';

<FullView>
  <LongContent />
</FullView>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `node` | | The content to scroll. |
| `setScrollHeight` | `bool` | `true` | Sizes the container to `calc(100vh - <its offsetTop>px)`. With `false` it measures nothing and its height is whatever your CSS gives it. |

`FullView` has no `propTypes` and takes no `className` or other props. The container has `overflow-y: auto`.

## Variants and states

The height is measured once on mount and again on every window resize. If the container's `offsetTop` is 0 it gets no height at all, so it behaves like a plain block. Changing `setScrollHeight` after the first render has no effect, because the measuring is set up on mount. It is not re-measured when something above it changes size (for example a banner appearing) until the window is resized.

## Accessibility

- It is a plain `div` with no role and no `tabindex`, so it adds nothing for a screen reader.
- A scrolling area is reached by keyboard through the focusable things inside it. Put links or controls in the content, and don't leave a long block of plain text as the only content.
- Because the content scrolls inside the page, check at a phone width that everything in it can still be reached.

## Do and don't

- Do use it once per page, as the main region under the fixed header.
- Do check it at a phone width: `100vh` can be taller than the visible area when a mobile browser's toolbar is showing.
- Don't nest one `FullView` inside another; one scrolling region per page is enough.
- Don't use it for a short block of content; it will leave empty space down to the bottom of the window.
- Don't set its height with CSS and leave `setScrollHeight` on; the measured inline height wins.
