---
priority: p3
branch: backlog/snap-type-to-scale
---

# Snap typography to the scale

The task: replace `pt` units, `11px`, `150%` and the 24px and 36px Badge sizes with the type styles in `tokens.json`, and move the font stacks to variables so `styles/type.scss` is the only typography file.

## Done

The `pt` units are fenced in: `tests/noPtUnits.test.js` lists the stylesheets that still use them (6 uses in 3 files) and fails for a new one, or when a listed one is fixed without updating the list. The design system's rule ("never use pt units") is now enforced for new code.

## Blocked

The rest needs the type styles in `tokens.json`, which is not in this repository, and changing sizes across the library is a design decision. What the code has now:

| `font-size` | uses | | `font-size` | uses |
| --- | --- | --- | --- | --- |
| 14px | 25 | | 24px | 3 |
| 12px | 21 | | 21px | 3 |
| 11px | 10 | | 16px | 3 |
| 20px | 8 | | 36px, 32px, 30px, 15px, 150% (2 each); `10pt` (3) | 2 or 3 each |
| 18px | 8 | | 26px, 120px, 85%, 80%, 70%, 0.9em, .65rem, 8pt, 11pt, 14pt, two `clamp()`s | 1 each |
| 13px | 7 | | `0` | 4 |
| 10px | 5 | | | |

The design system's own scale (`docs/project/design-system.md`) is 14px body, 12px small, 21px section and 32px page title, with weights 400 and 500 (600 for primary button labels). That doesn't cover what is in use: 18px and 20px are headings (the dialog titles are deliberately 18px), 24px and 36px are the Badge's sizes, and 16px is the form controls'. Snapping everything to four sizes would change the look of text throughout the library, and `pt` has no exact scale value (10pt is 13.3px, 14pt is 18.7px, 11pt is 14.7px, 8pt is 10.7px).

**Decide the scale**, then the rest is mechanical: give the sizes names (`--v-text-sm`, and so on; the other scale tokens are in `docs/features/theming.md` under "Scale tokens" if that branch has merged), map each value in the table to one, and replace the `pt`, `11px`, `13px`, `10px`, `150%` and Badge values. The `pt` entries in `tests/noPtUnits.test.js` come out as you go.

The font stacks: `font-family` is declared in `styles/type.scss`, `styles/components/forms.scss`, `MobilePhone`, `ComboBox` and `Icon` (the icon font, which should stay where it is), and in two styleguide pages that show the stacks as samples. Moving the stacks into variables defined once in `styles/type.scss` is a safe change, but it should come with the sizes so typography is settled in one pass.

To finish: decide the type scale, apply it, delete `tests/noPtUnits.test.js`'s list as it empties, and delete this file.
