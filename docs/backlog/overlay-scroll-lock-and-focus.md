---
priority: p1
components: [Modal, ModalDialog, Dialog, Alert, PopOver, Overlay, Drawer]
branch: backlog/overlay-scroll-lock-and-focus
---

# Overlays: check scroll lock, focus trap and focus restore in a real browser

The overlays now lock window scroll (counted, with scrollbar compensation), trap and restore focus, set `aria-modal` only when the trap is on, and use `CloseButton` for the close "x". See `docs/features/overlays.md`. The code and its tests are on the branch above (the hooks are in `components/Overlay/`); what is left is the part that needs a real browser.

## Unverified

Everything was tested in jsdom, which has no layout, no real scrollbar and no screen reader. Needed to finish this task:

1. **Desktop browser** (Chrome, Safari, Firefox), with the dev server (`make dev`): open each overlay from the styleguide pages Modal, ModalDialog, Dialog, Alert, PopOver and Overlay, on a page long enough to scroll.
   - The page behind doesn't scroll (wheel, keyboard, scrollbar drag) and doesn't jump sideways when the scrollbar disappears.
   - Tab and Shift+Tab stay inside; Escape closes (where it should); focus returns to the button that opened it.
2. **Mobile width** (375px, in the browser's device mode and on a real phone if there is one): the same, and that the dialog headers look right.
3. **iOS Safari**, which can scroll the page behind an `overflow: hidden` body with a touch drag. If it does, the lock needs another approach (see `docs/features/overlays.md`, Known limits); that would be its own task.
4. **CloseButton in the headers** of Modal, Dialog and ModalDialog (`size="sm"`): the hand-styled buttons were removed, so check the size, alignment next to the title, hover and focus ring, in light and dark.
5. **A screen reader** (VoiceOver): an overlay is announced as a dialog, focus lands inside, and the page behind isn't read.

To finish: record any problems as new backlog tasks, then delete this file.

## Not done, tracked separately

- `overlay-escape-closes-top-only`: Escape closes every open overlay, not just the top one.
