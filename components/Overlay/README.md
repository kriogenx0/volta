# Overlay

A dimming layer over the whole window, shown while `showing`, that reports clicks on the dimmed area.

## When to use

- **Behind something you position yourself**: a custom panel, menu or blocking state that needs the page dimmed and a click-away to dismiss it. You place the content above it; `Overlay` draws only the dim layer and renders nothing in place.
- Use [`Modal`](../Modal/README.md), [`Dialog`](../Dialog/README.md) or [`Alert`](../ModalAlert/README.md) for a dialog (they bring their own backdrop), [`Drawer`](../Drawer/README.md) for a side panel, and [`PopOver`](../Modal/README.md) for a panel with a backdrop and Escape handling. [`Dropdown`](../Dropdown/README.md) already uses an `Overlay` for its click-away.
- Use [`Layer`](../Layer/README.md) when you need content rendered into its own node on `<body>`.

## Usage

```jsx
import { Overlay } from 'volta';

<>
  <Overlay showing={open} onClick={() => setOpen(false)} />
  {open && <div className="my-panel">Panel content</div>}
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `showing` | `bool` | `null` | Adds the dim layer to `<body>` while `true` and removes it when `false` or unmounted. |
| `onClick` | `function` | | Called when the dimmed area is clicked. |

The layer is a fixed, full-window `div.volta-overlay.showing` appended to `<body>` (`Overlay.defaultClassName` is `volta-overlay`). It sets no `z-index`, so give the content above it its own positioned element and `z-index`. Children are not rendered. The component renders nothing where you put it.

## Accessibility

- The layer is decoration: no role, not focusable, not announced. It does not trap focus, so Tab can still reach the page behind it.
- A click is its only dismissal. It does not listen for Escape, so keyboard users need another way out: a close button, or a component that handles Escape (`Modal`, `Drawer`, `PopOver`).
- Content that opens above it should carry the dialog or menu semantics, focus handling and labels.

## Do and don't

- Do pair it with content that has a visible way to close, as well as the click-away.
- Do set `showing` from state and clear it in `onClick`; it never hides itself.
- Don't leave it showing while nothing is above it; the user sees a dimmed, unusable page.
- Don't use it to block the page without telling the user why; pair it with a [`Loader`](../Loader/README.md) or a message.
- Don't expect it to display children.
