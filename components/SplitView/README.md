# SplitView

A main pane beside a side pane that opens and closes, each pane scrolling on its own.

## When to use

- **A list or document with a details, filter or folder pane** next to it on desktop, shown or hidden by the caller (an inbox with a folder list, a table with a filter panel).
- Use [`Drawer`](../Drawer/README.md) for a side form or detail that slides over the page, [`Dialog`](../Dialog/README.md) for a blocking decision, and [`Card`](../Card/README.md) to group content without a second pane.
- It is not a resizable splitter: there is no drag handle, and the side pane is as wide as its own content.

## Usage

```jsx
import { SplitView, Button } from 'volta';

<>
  <Button onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'} folders</Button>
  <SplitView open={open} side={<Folders />}>
    <Messages />
  </SplitView>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `side` | `node` | | The side pane's content. Give it a width, since the pane sizes to it. |
| `open` | `bool` | `false` | Shows the side pane. Closed, it has no width and is hidden. |
| `setScrollHeight` | `bool` | `true` | Sizes the view to the window below its own top edge, so the panes scroll instead of the page. Use `false` when the parent sets the height. |
| `children` | `node` | | The main pane's content. It takes the remaining width. |

With `setScrollHeight`, the height is worked out when the view mounts and when the window is resized, as `100vh` minus the view's distance from the top of its offset parent. If that distance is zero, no height is set.

## Accessibility

- A closed side pane is `visibility: hidden`, so its links and buttons leave the tab order and the accessibility tree; opening it brings them back.
- The panes are plain containers with no role or label. If the side pane is a landmark (filters, folders), put a `nav` or labelled `section` inside it.
- The button that opens the side pane is yours: give it text that says what it shows, and keep it reachable when the pane is closed.

## Do and don't

- Do give the side content a fixed or maximum width, so the main pane keeps room.
- Do check a phone width: both panes sit side by side at every width, so on a 375px screen prefer a [`Drawer`](../Drawer/README.md) or keep the side pane narrow.
- Don't nest a `SplitView` with `setScrollHeight` inside another scrolling area; set `setScrollHeight={false}` and give the parent a height.
- Don't use it for a fixed two-column page layout with no hiding; use layout styles.
