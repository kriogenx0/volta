---
priority: p1
components: [Modal, ModalDialog, Dialog, Alert, PopOver, Overlay, Drawer]
---

# Overlays: lock window scroll, trap focus, restore focus

## Objective

When a modal-style overlay is open, the page behind it still scrolls, keyboard focus can leave it, and focus isn't returned to the control that opened it. Only Escape-to-close exists (`components/Overlay/useEscapeKey.js`).

## Requirements

- A shared hook or util (next to `useEscapeKey`) that, while an overlay is open:
  - locks window scroll without shifting the layout (compensate for the scrollbar width), and handles two overlays open at once (a count, not a boolean);
  - moves focus into the overlay, keeps Tab inside it, and returns focus to the previously focused element on close.
- Use it in Modal (both forms), ModalDialog, Dialog, Alert, PopOver and Overlay. Drawer is contained and only needs focus handling if it is modal.
- Add `aria-modal="true"` only once focus is actually trapped.
- Use `CloseButton` for the close "x" in Modal, Dialog and ModalDialog, which currently each draw their own.

## Acceptance criteria

- Tests: scroll is locked while open and restored after; nested overlays keep it locked until the last closes; Tab cycles inside; focus returns to the trigger.
- Checked in a real browser at desktop and mobile widths (iOS Safari scroll lock needs its own check).
