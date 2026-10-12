# Design system backlog

What remains to bring the code in line with the Volta design system (tokens: `styles/_colors.scss`; rules: `AGENTS.md`). Work items are ordered by dependency, so do them top to bottom. Counts are from the repo as of this commit; re-measure before starting.

## Done

- [x] Button: dead Tailwind variants/sizes removed (`secondary`, `ghost`, `sm`, `md`), colours use tokens.
- [x] Added `--v-color-danger-subtle` and `--v-on-accent`.
- [x] Removed the unused `styles/_common.scss`.

## 1. Theme foundation (do first; everything else depends on it)

- [ ] **Fix the `dark` mixin** (`styles/_mixins.scss`). It only matches `prefers-color-scheme: dark`, so it ignores an explicit `[data-theme='dark']`. Either make it honour both (`:root[data-theme='dark'] &` plus the media query scoped to `:root:not([data-theme])`) or delete it. Used in 23 SCSS files.
- [ ] **Remove `_dark` alias variables** (`$color_*_dark`, `$base_*_dark`) and their `@include dark { … }` overrides in 17 files. They point at the same variable, so the overrides are no-ops once the CSS variable flips.
- [ ] **Add missing tokens** to `_colors.scss` before replacing literals: `--v-color-danger-hover`, `--v-focus-ring`, and shadow (`sm/md/lg`), radius (`sm/md/lg/pill`), spacing (`1`–`6`) and z-index (`nav/modal/popover`) variables matching `tokens.json`. Update `components/theme.js` if any must be runtime-settable.
- [ ] **Resolve the contrast failures**: white on `#4a90e2` accent is about 3.3:1 and `text-subtle` `#808080` is about 3.9:1. Either darken the default accent (and derive hover/subtle from it) or restrict usage and document it.

## 2. Remove legacy colour APIs

- [ ] Migrate remaining users of `$color_*`, `$base_*`, `$trim_*`, `$active_color`, `$active_over_color`, `$select_color`, `$active_background` to `var(--v-*)`.
- [ ] Delete `components/_shared/legacy-colors.scss` and `legacy-color()` (4 component files use it or `rhythm()`); replace `rhythm()` with `space-*` tokens.
- [ ] Delete the `$colors` map and `property-color` / `text-color` / `bg-color` mixins once unused.
- [ ] Delete the stray `styles/_colors.scss`-adjacent `components/_shared/theme.scss` duplicates (`$active_color: #1274E0` conflicts with the real accent).
- [ ] Update `styleguide/views/ColorsExample` to show the new token names.

## 3. Replace hard-coded values in component SCSS

About 231 hex literals in 57 files. Most frequent: `#ccc` ×33, `#fff` ×31, `#000` ×12, `#333` ×11, `#eee` ×9, `#888` ×9. Mapping:

| Literal | Token |
| --- | --- |
| `#fff`, `#ffffff` | `surface` (backgrounds) or `on-accent` (text on fills) |
| `#ccc`, `#cccccc`, `#ddd` | `border-strong` |
| `#eee`, `#e6e6e6`, `#e0e0e0` | `border` |
| `#f1f1f1`, `#f2f2f2`, `#f6f6f6`, `#fafafa` | `surface-muted` |
| `#000`, `#111`, `#333` | `text` |
| `#444`, `#4d4d4d`, `#666` | `text-muted` |
| `#888`, `#999`, `#aaa`, `#808080` | `text-subtle` |
| `#f00`, `#ff0000`, `#c00`, `#900`, `#e30000` | `danger` |
| `#0070c9`, `#0055b7`, `#1274e0`, `#4a90e2`, `#2f90fb` | `accent` / `accent-hover` |

- [ ] Work one component per commit, starting with the ones in `components/Card`, `Field`, `Toggle`, `TextField`, `Dialog`, `Dropdown`, `Select`.
- [ ] Check each in the styleguide in light, dark and a non-default accent.
- [ ] Add a stylelint rule (`color-no-hex`) so new literals fail lint.

## 4. Off-scale values

- [ ] Spacing: snap 5→4, 7→8, 10→8/12, 15→16, 20→24. Duplicate `$spacing` (10px and 15px) is defined in `styles/components/lists.scss`, `ListDefinitions`, `Redactor` and the four `_image-crop.scss` files; replace with tokens.
- [ ] Radius: 3px, 5px and 50px → `radius-sm/md/lg/pill`; `border-radius: 50%` stays for true circles.
- [ ] Type: `pt` units (3 files), `11px`, `150%`, `24px`/`36px` Badge sizes → the type styles in `tokens.json`. Move the font stacks to variables so `type.scss` is the only typography file.
- [ ] Shadows: replace the 8 one-off `box-shadow` values with `shadow-sm/md/lg`; drop glows.
- [ ] z-index: replace numeric values and `$z-modal + N` with `z-nav/modal/popover`; remove duplicate `$z-fixed` definitions.
- [ ] Remove `!important` (7 files) and fix specificity instead.

## 5. Components and accessibility

- [ ] Every interactive component: hover, visible focus ring, disabled state, keyboard operation. Audit each of the 92 exports; record gaps in the styleguide.
- [ ] Icon-only buttons (`CloseButton`, `IconButton`, `ActionMenu` trigger) require `aria-label`.
- [ ] `Field` / `FormField` / `TextField`: link label, hint and error with `htmlFor`, `aria-describedby`, `aria-invalid`.
- [ ] Respect `prefers-reduced-motion`; route all transitions through `--v-anim-speed` / `--v-anim-ease`.
- [ ] Decide between the duplicated components and keep one: `Field` vs `FormField`, `Modal` vs `ModalDialog` vs `Dialog`, `DatePicker` vs `DateInput` vs `DateTime`, `CloseButton/index.js` vs `index.jsx`, `CheckboxGroup/index.jsx`, `Field/index.jsx`.
- [ ] Migrate `bsStyle`, `tiny` and the `type` prop on `Button` to `variant` / `size`; then remove the legacy handling.
- [ ] Replace `defaultProps` (62 files) with default parameters, which React 19 requires for function components.

## 6. Dependencies and tooling

- [ ] Drop `moment` and `lodash` from new code; plan removal (`date-fns` and `luxon` are already present).
- [ ] Fix test and lint tooling: install `jest-environment-jsdom`; make `npm run lint` work with the installed eslint (flat config).
- [ ] Add visual regression or at least a styleguide smoke test in light and dark.

## 7. Design system artifact

- [ ] Write guidelines for the remaining ~88 components (`components/<Name>/README.md` in the artifact).
- [ ] Build the library and add `bundle.js`, `bundle.css` and live previews to the artifact.
- [ ] Keep `tokens.json` in sync when `_colors.scss` changes; consider generating one from the other.
