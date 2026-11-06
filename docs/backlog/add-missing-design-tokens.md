---
priority: p1
branch: backlog/add-missing-design-tokens
---

# Add missing design tokens

Add to `styles/_colors.scss` before replacing literals: `--v-color-danger-hover`, `--v-focus-ring`, and shadow (`sm/md/lg`), radius (`sm/md/lg/pill`), spacing (`1`–`6`) and z-index (`nav/modal/popover`) variables matching `tokens.json`. Update `components/theme.js` if any must be runtime-settable.

## Acceptance
- Every token named in `tokens.json` has a matching `--v-*` variable.

## Status

Built on the branch above, in the cautious form (documented in `docs/features/theming.md`, "Scale tokens"):

- `--v-color-danger-hover`, `--v-focus-ring`, `--v-space-1`..`6`, `--v-radius-sm|md|lg|pill`, `--v-shadow-sm|md|lg`, `--v-z-nav|modal|popover` are in `styles/_colors.scss`. The two colours are in `components/theme.js`'s `tokens` and the `volta` preset; the scales are the same in every theme. Tests: `tests/scaleTokens.test.js` and `tests/themePreset.test.js`.
- Spacing (4/8/12/16/24/32) and radius (2/4/10/pill) come from the scale in `docs/project/design-system.md`, and a test ties the spacing to that line.
- Nothing uses the new tokens yet; the dependent tasks switch components over.

## Unverified

`tokens.json` is not in the repository (the design system names it as the source of truth), so "matching `tokens.json`" could not be checked. These values were derived rather than copied, and need confirming before the dependent tasks (`replace-one-off-shadows`, `replace-z-index-numbers`, `snap-radius-to-scale`, `snap-spacing-to-scale`, `replace-hex-literals-in-component-scss`, `migrate-legacy-color-variables`) run:

- `--v-shadow-sm|md|lg`: exact copies of the existing shadows `0 1px 3px rgb(0 0 0 / 20%)`, `0 4px 16px rgb(0 0 0 / 16%)` and `0 8px 24px rgb(0 0 0 / 14%)`; the dark-mode alphas (60, 55, 50%) are new.
- `--v-z-nav|modal|popover` = 100, 1000, 1100: the common existing values; ToastMessage (1100) and the fixed ProgressBar (1200) fit none of the three names.
- `--v-color-danger-hover` = `#ba0000` (the danger red darkened 8%, white label 6.8:1) and `--v-focus-ring` = the accent.

To verify: with the real `tokens.json` in the repository, compare each token it names against `styles/_colors.scss` (the names map to `--v-<group>-<step>`), correct any value here that differs, then delete this file.
