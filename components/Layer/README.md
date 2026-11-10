# Layer

Renders its children into a new element at the end of the page (a portal), so they escape clipping and stacking of the place they are written.

## When to use

- **An overlay that must sit above everything** and not be cut off by an ancestor's `overflow: hidden`, transform or stacking context: a full-screen cropper, a floating panel.
- Layers stack in the order they mount, so the one opened last is on top, with no z-index to manage.
- It is a low-level primitive: it adds no backdrop, no focus handling, no Escape key and no role. For a blocking decision use [`Dialog`](../Dialog/README.md) or [`Modal`](../Modal/README.md); for a side panel [`Drawer`](../Drawer/README.md); for a small floating panel [`PopOver`](../Modal/README.md).

## Usage

```jsx
import { Layer, Button } from 'volta';

<>
  {open && (
    <Layer>
      <div className="my_panel" role="dialog" aria-label="Details">
        <Button onClick={() => setOpen(false)}>Close</Button>
      </div>
    </Layer>
  )}
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `node` | | Rendered into the layer. With no children the layer stays empty. |

Each `Layer` appends one `<div class="volta-layer">` to `<body>` when it mounts and removes it when it unmounts. That element has no styles, so what you put in it positions itself (for example `position: fixed`). On its very first render it shows nothing; the children appear one render later, once the element exists.

## Accessibility

- Layer adds no role, label or focus handling. Give the content a `role` and `aria-label` (as above), move focus into it when it opens, return focus when it closes, and close it on Escape.
- It does not hide or disable the rest of the page, so screen-reader users can still reach what is behind it. For a modal behaviour use `Dialog` or `Modal`.
- The layer is the last element in `<body>`, so it comes last in reading order and in the Tab order.

## Do and don't

- Do mount a `Layer` only while it is needed (`{open && <Layer>...</Layer>}`); unmounting removes it from the page.
- Do keep a `Layer` out of any wrapper that has a click handler: React events still bubble through the portal to the component that rendered it, so clicks inside the layer reach that wrapper. `ImageUploader` renders its `Layer` as a sibling of the clickable wrapper for this reason.
- Don't use `z-index` numbers to order layers; mounting order does it.
- Don't expect it to dim the page or trap focus; it only moves where the content is drawn.
