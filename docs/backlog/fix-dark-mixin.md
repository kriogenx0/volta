---
priority: p1
components: [Card, TextField, Select, Dialog]
branch: backlog/fix-dark-mixin
---

# Check in a browser that components follow an explicit light or dark scheme

The `dark` mixin in `styles/_mixins.scss` already honoured an explicit `[data-theme]` (this task described it as broken, and was stale). On the branch above that is proven and kept that way by `tests/darkMixin.test.js`, which compiles the mixin and asserts the selectors it produces. See `docs/features/theming.md`, "Dark mode in component styles".

What was not done is the acceptance line that needs a browser.

## Unverified

"Components follow an explicit `data-theme` in light and dark in the styleguide." Checked from the compiled CSS only, not on screen. To verify:

1. Start the styleguide with `make dev`.
2. Set your OS to the opposite of the scheme you are testing, so a rule that wrongly follows the OS would show.
3. With the header's Auto / Light / Dark control, pick Light, then Dark, and look at a few components that use `@include dark` (for example Card, TextField, Select, Dialog) on the Components page.
4. They should match the chosen scheme, not the OS, in both directions; Auto should follow the OS.

If one doesn't, it is a stylesheet that bypasses the mixin or a hard-coded colour; record it as a new task. Otherwise delete this file.
