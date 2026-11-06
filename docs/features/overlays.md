# Overlays

Modal, ModalDialog, Dialog, Alert, PopOver, Overlay and Drawer: the layers that sit over the page. Four behaviours are shared, so every overlay answers the keyboard and the page behind it the same way.

## What it does for users

- **The page behind a modal overlay doesn't scroll.** While one is open, `<body>` gets `overflow: hidden`, and the width of the scrollbar that disappears is added as right padding so the page doesn't jump sideways. The body's own inline overflow and padding are put back when the last overlay closes. Locks are counted: with two overlays open the page stays locked until both are closed.
- **Focus is trapped.** Focus moves to the first focusable element inside (an `Alert` prompt puts it in the text field), Tab and Shift+Tab wrap at the ends, and focus that got outside is pulled back. With two overlays open only the top one traps, so the one underneath doesn't pull focus out of the one on top.
- **Focus comes back.** When the overlay closes, focus returns to the control that had it before, unless the user has already moved it somewhere else or that control has left the page.
- **Escape closes** the overlays that can close (Modal, ModalDialog, Dialog with `closeOnOverlayClick`, PopOver, Alert, Drawer).
- **They say they are modal**: `aria-modal="true"` on the dialog, set only when the trap is actually on.
- **The close "x" is `CloseButton`** in Modal, Dialog and ModalDialog (`size="sm"`, the compact version for a header), so it looks and behaves like every other close button.

## Which overlays are modal

| Component | Locks scroll and traps focus | Notes |
| --- | --- | --- |
| `Modal` | while open (`show`, or by default in the standalone form) | `modal={false}` turns it off, for a modal shown in the page flow |
| `ModalDialog` | while open | not with `inlineMode`, which is in the page flow |
| `Dialog` | while open | not with `inlineMode` |
| `Alert` | while it is rendered | |
| `PopOver` | while open and `fullSize` (the default) | the in-place form (`fullSize={false}`) is a light-dismiss layer like a menu, so it neither locks nor traps; pass `modal` to change either way |
| `Overlay` | scroll lock only, while `showing` | it draws just the dimming layer and has no content to trap |
| `Drawer` | no | it is contained in its nearest positioned ancestor, not the window |

## Code

The behaviour lives in `components/Overlay/`, next to the Escape hook:

- `useScrollLock(active)`: the counted lock.
- `useFocusTrap(containerRef, active)`: the trap and the restore, with a stack of traps.
- `useModalBehavior(containerRef, active)`: both together; what Modal, PopOver and Alert call.
- `useEscapeKey(onEscape, active)`: unchanged.

A new overlay that covers the window should call `useModalBehavior` with the ref of its panel (give the panel `tabIndex={-1}`), and set `aria-modal` only when it does.

## Tests

- `tests/Overlay/useScrollLock.test.jsx`: lock and release, inactive, counting, restoring the body's own inline styles, the scrollbar-width padding.
- `tests/Overlay/useFocusTrap.test.jsx`: focus in, wrapping both ways, skipping disabled/hidden/`tabindex=-1`, pulling focus back, restoring (and not when the user moved it or the opener left), two traps.
- `tests/Overlay/modalBehavior.test.jsx`: each of Modal (both forms), ModalDialog, Dialog, PopOver and Alert locks, says it is modal, traps, and returns focus; the in-page cases don't lock; two overlays at once; Alert's initial focus. The tests fail with the hook removed.

## Known limits

- **iOS Safari** can still scroll the page behind an overlay with a touch drag; `overflow: hidden` on `<body>` isn't enough there. Not handled.
- **`position: fixed` elements** outside the body's flow (a fixed header) shift sideways by the scrollbar's width when the lock removes it; only the body is compensated.
- **Escape closes every open overlay**, not only the top one: each listens on the document.
- Focus is restored by calling `focus()` on the element that had it, so an opener that is no longer focusable gets nothing.
- Nothing here has been used in a real browser or with a screen reader; the behaviour is tested in jsdom.

## History

- 2026-11-05 (branch `backlog/overlay-scroll-lock-and-focus`, not merged or deployed): added the scroll lock, the focus trap and restore, `aria-modal`, the `modal` prop on Modal and PopOver, `CloseButton` `size`, and `CloseButton` now merges a passed `className` instead of replacing its own.
- Not verified: scroll lock and focus in a real browser (desktop and mobile widths, iOS Safari), the look of `CloseButton` in the dialog headers (the old hand-styled buttons were removed), and screen reader announcements.
- Not implemented: closing only the top overlay on Escape, an iOS-safe scroll lock.
