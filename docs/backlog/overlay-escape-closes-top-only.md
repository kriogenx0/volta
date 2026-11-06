---
priority: p3
components: [Modal, ModalDialog, Dialog, Alert, PopOver, Drawer]
---

# Escape should close only the top overlay

Each overlay listens for Escape on the document (`components/Overlay/useEscapeKey.js`), so with two open, one Escape closes both. The focus trap already keeps a stack of open overlays (`components/Overlay/useFocusTrap.js`); Escape should use the same idea.

## Requirements

- Escape closes only the overlay on top. The one underneath closes on the next Escape.
- Overlays that don't trap focus (Drawer, an in-place PopOver) take part in the same ordering, so an Escape pressed over a Drawer inside a Modal closes the Drawer first.
- `Alert` handles Escape (and Enter) itself; make it follow the same rule.

## Acceptance criteria

- Tests: with two overlays open, Escape closes the top one only; after it closes, the next Escape closes the other.
- `docs/features/overlays.md` no longer lists this under Known limits.
