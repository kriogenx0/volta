---
priority: p1
branch: backlog/resolve-contrast-failures
---

# Resolve the contrast failures

The audit is in `docs/features/theming.md`, "Contrast", and `tests/contrast.test.js` keeps it honest. What the branch above did, and what it did not, because the rest are decisions that are yours.

## Done

- **Tertiary text.** `--v-color-trim-less-subtle` (the task's "text-subtle") was `#808080`, 3.95:1 on white. It is now `#6e6e6e`: 5.10:1 on white and 4.55:1 on the muted surface (dark mode was already 7.15:1). The three tinted presets (Slate, Sepia, Midnight) had their own too-light grays and were regenerated. Body and secondary text pass in both schemes.
- **An accessible Volta, opt-in.** `volta-aa` (`Theme.applyTheme('volta-aa')`, or the Theme dropdown in the styleguide) is the stock blue's hue moved just far enough to pass: light accent `#1f6bc1` with a white label, dark accent `#65a1e6` with a dark label. Every accent pairing passes AA in both schemes, and a test holds it there. The default is unchanged.
- **A ratchet.** `tests/contrast.test.js` lists the pairings that still fail and fails if a new one appears, or if one is fixed without the list being updated.

## Blocked

Two decisions, because both change how the product looks.

1. **Make the accent pass by default?** The stock accent `#4A90E2` is 3.29:1 for a white label (every primary button), for accent text and links on white, and 2.85:1 / 2.75:1 on its own tint (an active item), in light and dark. The choice:
   - **Make `volta-aa` the default.** The brand blue gets a little deeper in light mode and lighter (with dark button text) in dark mode, everywhere. To do it: copy the `volta-aa` values into `styles/_colors.scss` (`:root` for light; `dark-palette` for dark, which currently inherits the light accent), make the `volta` preset in `components/themePreset.js` match (a test fails until it does), delete `volta-aa`, and empty the accent entries from `KNOWN_BELOW_AA` in `tests/contrast.test.js`.
   - **Keep `#4A90E2`** and treat `volta-aa` as the way to get AA, which needs a line in the design system saying primary labels on the stock accent are below AA.
2. **The status colours.** Each of danger, success and warning is used as a fill and as text, so one value can't serve both: danger is 4.92:1 as text on the white page but 4.14:1 on the dark page, and success (3.44:1) and warning (3.93:1) fail on one page each. Fixing it means separate text tokens (for example `--v-color-danger-text`) with values per scheme, and then moving the components that use these colours as text onto them. That adds tokens and touches components, so it needs your go-ahead; the failing pairings are the last entries in `KNOWN_BELOW_AA`.

## Unverified

The grays and `volta-aa` were chosen from contrast formulas, not looked at. In the styleguide (`make dev`): check the darker tertiary text (placeholders, captions, the large close button) in light mode, and flip the Theme dropdown to "Volta AA" to judge the blue in light and dark against the stock one.

To finish: decide the two points above, make the changes they imply, and delete this file.
