# PageWidth

A centered content column, 960px wide at most, with side padding, that keeps page content a readable width.

## When to use

- **Wrapping the content of a page or section** so it lines up and does not stretch across a wide window. Use it once per view region, around [`PageHeading`](../PageHeading/README.md) and the content below it.
- Use [`FullView`](../FullView/README.md) for a view that fills the window and [`SplitView`](../SplitView/README.md) for a two-pane layout. Use [`Card`](../Card/README.md) to group content inside the column.
- It is only a container: it does not scroll, label or style its content.

## Usage

```jsx
import { PageWidth, PageHeading } from 'volta';

<PageWidth>
  <PageHeading text="Settings" />
  <p>Your account and notification settings.</p>
</PageWidth>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `className` | `string` | | Added after `volta-page_width c-page_width`. |
| `children` | `node` | | The page content. |

The column is `max-width: 960px`, centered, with 30px of padding on each side, so on a phone the content stays 30px from the edges. The extra `c-page_width` class is kept for views whose own stylesheets target it by name.

## Accessibility

- It is a plain `<div>` with no role, so it adds nothing to the accessibility tree. Use a `<main>` or `<section>` inside or around it where the page needs landmarks.
- Padding keeps text off the edge of the screen at every width; do not remove it with `className` overrides.

## Do and don't

- Do wrap each page's content once, so every page lines up at the same width.
- Do check the layout at 375px; the 30px side padding leaves about 315px for content.
- Don't nest a `PageWidth` inside another; the second one only adds more padding.
- Don't override the width with a view stylesheet for one page; use a different container (`FullView`) for wide content.
- Don't put a full-bleed banner inside it; the banner would be inset.
