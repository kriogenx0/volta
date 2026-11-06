---
priority: p2
components: [Dropdown, DatePicker]
---

# Dropdown: panel position and close behaviour

## Objective

Two problems in `Dropdown`:

- `.dropdown-contents` is positioned at `top: 0`, so an open panel covers its own trigger instead of opening below it.
- Any click inside the contents closes the dropdown. `DatePicker` works around it by stopping click propagation around its calendar, so paging months doesn't close the picker.

## Requirements

- Open the panel below the trigger (and flip above when there is no room); keep `constrainWidth` working.
- Close on an outside click, Escape, or a choice, not on every click inside; let contents opt in to closing (for example with a render prop or a `data-` attribute on the control that should close it).
- Remove the click-propagation workaround from `DatePicker` once the contents no longer close it.

## Acceptance criteria

- Tests for position class/flip, outside click, Escape, and an interactive child that does not close the panel.
- DatePicker month paging works without the workaround.
- Checked in a browser at desktop and mobile widths.
