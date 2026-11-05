---
priority: p3
components: [MobilePhone, VideoPlayer, ImageCrop]
---

# Dark mode, tokens and touch support for MobilePhone, VideoPlayer and ImageCrop

## Objective

- `MobilePhone.scss` and `VideoPlayer.scss` use hex colours and have no dark mode.
- `ImageCrop` can only be dragged with a mouse: no touch and no keyboard, so the crop area can't be moved on a phone.

## Requirements

- Move both stylesheets to `--v-*` tokens so one set of rules serves light and dark.
- ImageCrop: support pointer events (mouse, touch and pen) for dragging, and arrow keys for moving the crop area with a visible focus state.

## Acceptance criteria

- Both components look correct in light and dark mode (checked in a browser).
- ImageCrop is operable on a 375px-wide touch device and from the keyboard; tests cover the keyboard path and pointer events.
