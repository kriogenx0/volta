---
priority: p1
---

# Fix the `dark` mixin

The mixin in `styles/_mixins.scss` only matches `prefers-color-scheme: dark`, so it ignores an explicit `[data-theme='dark']`.

## Requirements
- Make it honour both (`:root[data-theme='dark'] &` plus the media query scoped to `:root:not([data-theme])`), or delete it. It is used in 23 SCSS files; re-measure first.

## Acceptance
- Components follow an explicit `data-theme` in light and dark in the styleguide.
