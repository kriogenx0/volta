---
priority: p3
components: [Tabs, Dropdown, Drawer, Select, TextField, ToastMessage, Loader]
branch: backlog/respect-reduced-motion
---

# Check reduced motion and the seven retimed transitions in a real browser

Done on the branch above (see `docs/features/motion.md`): `prefers-reduced-motion: reduce` sets `--v-anim-speed` to `0.01ms`, so every transition (and the toast's enter and leave) is all but instant; the seven transitions that had their own durations use the variable; and `tests/reducedMotion.test.js` keeps both true. Easing was already routed through `--v-anim-ease` except three deliberate cases.

## Unverified

jsdom has no media queries or CSS, so the behaviour itself was not seen. In the styleguide (`make dev`):

1. **Reduce motion**: turn on "Emulate CSS media feature prefers-reduced-motion: reduce" (Chrome DevTools, Rendering tab) or the OS "Reduce motion" setting. Hover a button, open a Dropdown and a Drawer, switch tabs, show a toast: all should be instant, and the toast should still go away (it dismisses on `animationend`).
2. **Your own speed wins**: with reduce motion on, move the styleguide's speed slider; the transitions should follow it.
3. **The seven retimed transitions** (form field hover and focus, table rows, the layout padding, type colour, and two in the styleguide) are now 150ms where they were 100 to 200ms: confirm they still feel right.
4. **Loaders**: the `Loader` variants keep moving under reduce motion, by design. Decide whether any of them should slow or stop; if so, record a task.

If anything is off, fix it or record a task; otherwise delete this file.
