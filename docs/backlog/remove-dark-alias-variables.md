---
priority: p1
depends_on: [fix-dark-mixin]
---

# Remove `_dark` alias variables

Remove `$color_*_dark` and `$base_*_dark` and their `@include dark { … }` overrides (17 files at last count). They point at the same variable, so the overrides are no-ops once the CSS variable flips.

## Acceptance
- No `_dark` aliases remain; light and dark look unchanged in the styleguide.
