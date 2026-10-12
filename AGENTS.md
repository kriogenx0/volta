# AGENTS.md

UI work in this repo follows the Volta design system. Tokens: `styles/_colors.scss` (`--v-*` variables). Full token set and guidelines: https://claude.ai/artifact/NvqB2qq26do7JhME6sBdDY


Rules for any AI agent (or human) writing UI with Volta. Read `tokens.json` for values; never guess them. Where a rule and the existing code disagree, the rule wins and the code is the thing to fix.

## 1. Always

1. **Use tokens, never literals.** Every colour, space, radius, shadow and z-index comes from `tokens.json`. In SCSS use the `--v-*` custom properties (table in README). No hex, `rgb()`, `#f00`, `#ccc`, `#fff`.
2. **One variable, two themes.** Colour tokens flip under `[data-theme='dark']` and `prefers-color-scheme`. Reference the token once. Do not add `@include dark { … }` blocks or `_dark` Sass variables to new code.
3. **Reuse before you build.** Check `components/index.js` (92 exports) first. Compose existing components; add a variant or prop rather than a sibling component.
4. **Variants are props.** `<Button variant="primary" size="sm">`. Not new CSS classes, not `bsStyle`, not `tiny`.
5. **Accent is runtime-set.** Anything "brand coloured" uses `--v-accent` / `--v-accent-hover` / `--v-accent-subtle`. Never hard-code the blue.
6. **Keep contrast.** Body text 4.5:1 on its ground in both themes. `text-subtle` and `inactive` never carry essential information. Never convey state by colour alone.
7. **Motion uses the global speed.** `transition: … var(--v-anim-speed) var(--v-anim-ease)`. Respect `prefers-reduced-motion`.
8. **Every interactive element has** a visible focus state, a hover state, a disabled state, and works from the keyboard. Icon-only buttons need `aria-label`.
9. **Forms:** wrap controls in `Field` (label + hint + error). Errors use `danger` plus message text, shown via `ErrorText`.
10. **New component checklist:** `components/<Name>/<Name>.jsx`, `<Name>.scss`, `index.js`, PropTypes, an `<Name>-examples.jsx` for the styleguide, export in `components/index.js`, a test if it has logic.

11. **Hover everything interactive** with a subtle change (a step of `surface-muted`, `border-strong` or `accent-hover`), and keep animations to the global speed.
12. **Document spacing.** Every margin and padding uses a `space-*` token; new values require adding a token first.

## 2. Never

- Never use Tailwind classes (`bg-gradient-to-br from-lilac`, `rounded-lg`, `dark:`) in components. The repo has no Tailwind setup; those classes in `Button.jsx` are dead and should be removed.
- Never use `!important`, inline `style` for colour/spacing, or `z-index` numbers. Use the `z-*` tokens.
- Never add gradients, glows, or decorative shadows beyond `shadow-sm/md/lg`.
- Never use more than one `primary` button per view region.
- Never use pt units, vendor-prefix mixins, or `lodash`/`moment` in new code (`date-fns`/`luxon` are present; prefer the platform).
- Never import from `styles/_colors.scss` legacy names (`$color_*`, `$base_*`, `$active_color`, `legacy-color()`). They are deprecated aliases kept only for old files.
- Never invent a token. If one is missing, propose it in `tokens.json` first.

## 3. Choosing things

| Need | Use |
| --- | --- |
| Main action | `Button variant="primary"` |
| Secondary action | `Button variant="default"` (or `secondary`) |
| Low emphasis / toolbar | `Button variant="link"` (or `ghost`) |
| Destructive | `Button variant="danger"`, behind a confirm `Dialog` |
| On/off setting, applies immediately | `Toggle` |
| On/off choice submitted with a form | `Checkbox` |
| One of 2-5 | `RadioGroup` or `SegmentedControl` |
| One of many | `Select` / `ComboBox` / `AutoComplete` |
| Blocking decision | `Dialog` / `ModalAlert` |
| Side form or detail | `Drawer` |
| Transient message | `Message` |
| Empty state | `Empty` |

## 4. Scale cheat-sheet

- Spacing: 4 / 8 / 12 / 16 / 24 / 32. Snap legacy 5→4, 7→8, 10→8 or 12, 15→16, 20→24.
- Radius: 4px by default; 2 for tiny; 10 for overlays; pill for toggles/avatars.
- Type: 14px body, 12px small, 21px section, 32px page title. Weights 400 / 500 only; 600 for primary button labels.
- Breakpoint: 640px (`@include mobile`).

## 5. Cleanup backlog (do when touching these files)

1. Replace the ~130 hard-coded hexes in `components/**/*.scss` (most: `#ccc` ×33, `#fff` ×31, `#000`, `#333`, `#eee`, `#888`) with tokens.
2. Change the `dark` mixin in `styles/_mixins.scss` to also honour `[data-theme='dark']`, or delete it as redundant.
3. Remove `legacy-colors.scss`, the `_dark` alias variables and the duplicate `$spacing` / `$z-fixed` definitions.
4. Delete the unused `styles/_common.scss` stub, Tailwind classes in `Button.jsx`, and `MODERN_*` maps.
5. Replace off-scale values: radii 3 / 5 / 50px, font sizes 10pt / 11px / 150%, custom blues (`#0070c9`, `#0055b7`, `#1274e0`) → `accent`.
