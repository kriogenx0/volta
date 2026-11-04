---
priority: p2
depends_on: [migrate-legacy-color-variables]
---

# Delete legacy colour helpers

- Delete `components/_shared/legacy-colors.scss` and `legacy-color()` (4 component files use it or `rhythm()`); replace `rhythm()` with `space-*` tokens.
- Delete the `$colors` map and the `property-color` / `text-color` / `bg-color` mixins once unused.
- Delete the duplicate `components/_shared/theme.scss` (`$active_color: #1274E0` conflicts with the real accent).
- Update `styleguide/views/ColorsExample` to show the new token names.
