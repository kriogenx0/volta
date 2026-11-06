---
priority: p2
components: [Dropdown, DropdownList, ActionMenu, DatePicker]
branch: backlog/dropdown-panel-position-and-close
---

# Check the Dropdown panel position and closing in a real browser

On the branch above the panel opens below its trigger (flipping above when it doesn't fit), a click inside no longer closes it (`data-dropdown-close` marks a choice, `closeOnContentClick` restores the old rule), outside clicks close it with or without the overlay, and `DatePicker` no longer needs its click and position workarounds. See `docs/features/dropdown.md`. The code and its tests are done; what is left needs a real browser.

## Unverified

Position and the flip were tested with the layout mocked, since jsdom has no layout. With the dev server (`make dev`), on the Dropdown, DropdownList, ActionMenu and DatePicker pages:

1. The panel appears just below the trigger, not over it, at desktop and 375px widths, in light and dark.
2. Put the trigger near the bottom of a short window (resize the window, or scroll so the trigger is low): the panel opens above it. Scroll it back up and reopen: below again.
3. A DatePicker: the arrows page months without closing it; choosing a day, Escape, and a click outside all close it.
4. An ActionMenu and a DropdownList: choosing an item closes them.
5. Anything in your own apps that used a click inside to close a Dropdown now needs `data-dropdown-close` on the choice, or `closeOnContentClick` on the Dropdown.

Known and not done: the panel does not move if the window is resized or scrolled while it is open, and only the vertical direction flips (a trigger near the right edge can still push the panel off that side). If either matters, add a task.

To finish: confirm the points above, then delete this file.
