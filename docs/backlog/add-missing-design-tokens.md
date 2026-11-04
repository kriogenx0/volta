---
priority: p1
---

# Add missing design tokens

Add to `styles/_colors.scss` before replacing literals: `--v-color-danger-hover`, `--v-focus-ring`, and shadow (`sm/md/lg`), radius (`sm/md/lg/pill`), spacing (`1`–`6`) and z-index (`nav/modal/popover`) variables matching `tokens.json`. Update `components/theme.js` if any must be runtime-settable.

## Acceptance
- Every token named in `tokens.json` has a matching `--v-*` variable.
