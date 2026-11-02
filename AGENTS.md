# Agents

### Design Principles

1. Responsive on all devices - phones, tablets, and larger displays should be considered for all pages.
2. Native UI Components should appear consistent on all devices. If browsers affect this, all native components should be styled. This includes dialog boxes, buttons, textfields, selects (dropdowns), checkboxes, radio buttons.
3. Interactive Design - Components that the user can click on, should change when the cursor is over them. Components that the user cannot click on, should not change when mousing over.
4. View Hierarchy - Shared / View Specific - The majority of shared…


### Frontend Requirements

#### Responsive Design
All pages should consider different widths and fit the content appropriately without having to scroll horizontally unless intended. Dark mode should always exist for shared components.

#### Styles
Style tags should never be used in html unless they are absolutely necessary or its part of CSS modules. SCSS is the preferred compiler for CSS. CSS files should be loaded and cached. CSS should only exist app-wide or view-specific. App-wide examples are resets, fonts, themes, colors, global styles, ui components, libraries, and shared resources. View-specific should be lean and make unique changes for that particular view.

#### Class Names
Class Names should be similar to OOCSS, but slight differences.
- Use a single dash to show inheritance, namespacing, or a relationship with a component.
- Use two dashes (--) to show a single class has different states applied to it. (eg. view-users-hover).
- Use underscores to show one term with many words, not a relationship. (eg. active_users, network_segments, user_logins)

#### Inheritance
There should be a set of layers to follow cascading/specificity:
1. Libraries
2. App
3. View

#### JavaScript
Javsacript tags should never be used in html, unless its specifically for data (cannot be cached) or required by a library. JavaScript should be loaded from files, that are cached by the browser. TypeScript is permitted if using vite or webpack.

#### Middleware
Any failed API calls should show an error. Failed authentication requests should require reauthentication.

#### UI Components
Any common recurring UI components such as buttons, inputs, textfields, selects, dropdowns, checkboxes, radio buttons, form elements, modals, panes, cards, etc. should always be saved to their own files. This means their own SCSS and if its a robust enough component, its own JavaScript. It is robust when there is javascript put on the component in order to function (eg. not buttons, but modals). Typography should exist is one scss file. Margin and padding should should be one one scss file. UI components should have a root class that is prepended with "ui-" (eg. ui-button, ui-modal). All UI components should have a light and dark mode. Any UI component that the user can interact with should have at least a subtle hover state. If the user can't interact with it, it probably shouldn't have a hover state.

#### Native Components
Native dialog boxes should not be used if possible. Use a modal UI component. Native form components (input texts, select tags, checkbox, radio) should be styled by using a matching UI components.

#### Views
Every "page" should have its own view. Views can override UI component scss with their own scss. Views should have a root css class that starts with "view-" and is lowercase. (eg. view-studies-list).

#### Data File
The purpose of this is to separate data from views like in Model in MVC or Data Tier in Three-Tier Architectures. There should always be a data file for that has parity with the data entity. If the source of the data entity exists in another API, the data file should attempt to stay in sync with that data. For example, if there's an enumeration, that should exist in the data entity's file. All data-only functions (and definitely pure functions) should exist in the data file, for example Filtering, Searching, Sorting, aggregation functions that are only of that single data entity should exist in that data file. This makes unit testing data functions very easy. Filenames should be singular.

#### Frontend Views
Views should be in view folder and contain every file type for that view (html, jsx, js, scss, css, etc.) unless its a shared component.

#### Library Utilities
Pure functions that are utilities should be in util folder.

#### Accessibility Standards
Follow https://www.w3.org/TR/WCAG21/ for standards. Use ARIA Attributes for accessibility.

#### Compilers
If using a compiler, if in the dev environment (NODE_ENV?), do not obfuscate and provide a sourcemap. If in production, obfuscate, minify, and optimize for performance.

## Volta design system

UI work in this repo follows the Volta design system. Tokens: `styles/_colors.scss` (`--v-*` variables). Full token set and guidelines: https://claude.ai/artifact/NvqB2qq26do7JhME6sBdDY


Rules for any AI agent (or human) writing UI with Volta. Read `tokens.json` for values; never guess them. Where a rule and the existing code disagree, the rule wins and the code is the thing to fix.

## 1. Always

1. **Use tokens, never literals.** Every colour, space, radius, shadow and z-index comes from `tokens.json`. In SCSS use the `--v-*` custom properties (table in README). No hex, `rgb()`, `#f00`, `#ccc`, `#fff`.
2. **One variable, two themes.** Colour tokens flip under `[data-theme='dark']` and `prefers-color-scheme`. Reference the token once. Do not add `@include dark { … }` blocks or `_dark` Sass variables to new code.
3. **Reuse before you build.** Check `components/index.js` (92 exports) first. Compose existing components; add a variant or prop rather than a sibling component.
4. **Variants are props.** `<Button variant="primary" size="small">`. Not new CSS classes, not `bsStyle`, not `tiny`.
5. **Accent is runtime-set.** Anything "brand coloured" uses `--v-accent` / `--v-accent-hover` / `--v-accent-subtle`. Never hard-code the blue.
6. **Keep contrast.** Body text 4.5:1 on its ground in both themes. `text-subtle` and `inactive` never carry essential information. Never convey state by colour alone.
7. **Motion uses the global speed.** `transition: … var(--v-anim-speed) var(--v-anim-ease)`. Respect `prefers-reduced-motion`.
8. **Every interactive element has** a visible focus state, a hover state, a disabled state, and works from the keyboard. Icon-only buttons need `aria-label`.
9. **Forms:** wrap controls in `Field` (label + hint + error). Errors use `danger` plus message text, shown via `ErrorText`.
10. **New component checklist:** `components/<Name>/<Name>.jsx`, `<Name>.scss`, `index.js`, PropTypes, an `<Name>-examples.jsx` for the styleguide, export in `components/index.js`, a test if it has logic.

11. **Hover everything interactive** with a subtle change (a step of `surface-muted`, `border-strong` or `accent-hover`), and keep animations to the global speed.
12. **Document spacing.** Every margin and padding uses a `space-*` token; new values require adding a token first.

13. **Theme in one place.** A single theme file colours the whole UI and every component has light and dark. Typography lives in one file (`styles/type.scss`).
14. **Prefer native elements** (`button`, `input`, `select`, checkbox, radio, popover) under the styling, kept functional but restyled. Every component is accessible: roles, labels, keyboard, focus.

## 2. Never

- Never use Tailwind classes (`bg-gradient-to-br from-lilac`, `rounded-lg`, `dark:`) in components. The repo has no Tailwind setup; they were removed from `Button.jsx`.
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
| Secondary action | `Button variant="default"` |
| Low emphasis / toolbar | `Button variant="link"` |
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
4. See `docs/backlog.md` for the full ordered list.
5. Replace off-scale values: radii 3 / 5 / 50px, font sizes 10pt / 11px / 150%, custom blues (`#0070c9`, `#0055b7`, `#1274e0`) → `accent`.
