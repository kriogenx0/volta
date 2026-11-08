---
priority: p2
components: [Button, Checkbox, Radio, RadioGroup, Select, TextField, Toggle, Tabs, Dropdown, Slider, ColorPicker, ImageCrop]
branch: backlog/audit-interactive-states
---

# Check hover, focus and disabled states in a real browser

The keyboard half of this audit is done on the branch above, and is enforced by `tests/interactiveStates.test.jsx` (see `docs/features/interactive_states.md`): every click-only element is now a control or a reviewed exception, no tab stop is positive, and no stylesheet removes the focus outline without a replacement. It found and fixed `Tabs` (no keyboard access at all), `FileUploader` and `VideoUploadPlayer`.

The task also asked that every interactive component have a hover state, a visible focus ring and a disabled state. Those are about how things look, and jsdom has no CSS, so they were not audited.

## Unverified

For each interactive component in the styleguide (`make dev`), in light and dark, and under one non-default theme (`Theme.applyTheme('sepia')`):

1. **Hover**: a subtle change on anything clickable, none on anything that isn't, and no change in size or position.
2. **Focus**: tab to it and check a clear indicator appears. `TextField`, `Select` and `ComboBox` only change their 1px border to the accent colour; decide whether that is enough, or give them a ring like `Slider`'s. The new `Tabs` ring is `outline: 2px solid var(--v-accent)` inset by 2px: check it isn't clipped by the strip's border.
3. **Disabled**: looks disabled, doesn't react to hover or click, isn't in the tab order.
4. The tab list: arrow keys, Home, End, Enter and Space, and a screen reader reading "tab, 2 of 3, selected".

Record each gap as a new task named for the component, then delete this file.

## Related

`tabs-unselected-text-contrast`: unselected tab labels are 1.61:1 in light mode.
