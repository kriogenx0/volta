---
priority: p3
components: [ImageCrop]
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
