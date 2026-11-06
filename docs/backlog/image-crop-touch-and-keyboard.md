---
priority: p3
components: [ImageCrop]
depends_on:
  - convert-class-components-to-hooks
branch: backlog/image-crop-touch-and-keyboard
---

# ImageCrop: touch and keyboard support

## Objective

`ImageCrop` can only be dragged with a mouse: no touch and no keyboard, so the crop area can't be moved on a phone or by a keyboard user. (`MobilePhone` and `VideoPlayer` no longer have hard-coded colours, so their dark-mode part of this task is done.)

## Requirements

- Support pointer events (mouse, touch and pen) for dragging the crop area.
- Arrow keys move the crop area, with a visible focus state; announce the position or size change to assistive technology.

## Acceptance criteria

- Operable on a 375px-wide touch device and from the keyboard.
- Tests cover the keyboard path and pointer events.
- Checked in a real browser, since jsdom can't judge dragging.

## Blocked

Waits for `backlog/convert-class-components-to-hooks`, which rewrites `ImageCrop` from a class to a function component with hooks. This task rewrites the same drag code (mouse listeners to pointer events, a key handler), so building it on the class version would conflict with that merge and be thrown away. Do it after that branch merges; `depends_on` names it (the task file stays in `docs/backlog/` until `Map` is converted too, so check that branch's merge, not just the file).

What to build on the hooks version (`components/ImageCrop/ImageCrop.jsx`):

- Replace `onMouseDown` on `.icr_screen` with `onPointerDown`, and the page-wide `mousemove`/`mouseup` listeners (added by the effect on `moving`) with `pointermove`/`pointerup`/`pointercancel`; call `setPointerCapture` on the screen and set `touch-action: none` on `.icr_screen` so a touch drag doesn't scroll the page. Keep the left-button-only rule for mice (`event.pointerType === 'mouse' && event.button !== 0`).
- Make `.icr_screen` focusable (`tabIndex={0}`, `role="application"` or a labelled group with instructions via `aria-describedby`), with a visible `:focus-visible` ring from the accent token. Arrow keys move the picture by 1px (10px with Shift) through `constrain`; Home or the existing Center button re-centres; `+`/`-` scale through `changeScale`.
- Announce the position through a polite live region (for example "Moved left, 12 pixels from the left edge"), updated after a key press and not on every pixel of a drag.
- Tests: pointer events (`fireEvent.pointerDown` and friends; jsdom lacks `setPointerCapture`, so stub it), the keyboard path and the live-region text, and the left-button rule.
- Check at 375px width on a touch device or emulation: the crop frame fits and the touch target of the controls is at least 44px.
