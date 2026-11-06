# Theming

A theme is a small piece of data that restyles every component at once. The whole look of Volta (accent, page and text colours, borders, status colours, in light and in dark) comes from 17 CSS custom properties (`--v-*`). Replacing the theme means replacing the values of those properties, and nothing in a component has to change.

## What it does for users

- **Replace the whole look at runtime.** `Theme.applyTheme('ocean')` or `Theme.applyTheme(myTheme)` recolours every themed component immediately, no rebuild.
- **Thirteen ready-made themes** (`Theme.presets`), from the stock blue to teal, green, orange, pink, purple, amber, magenta, indigo, blue-gray, graphite, warm sepia and a navy-and-cyan "midnight". Twelve are checked against WCAG AA contrast in light and dark.
- **Light and dark come with the theme.** Each theme says what it looks like in both; the scheme that is showing (an explicit `light` or `dark`, or the OS preference) picks the half.
- **A custom accent on top.** `Theme.setAccentColor('#e0405c')` recolours the accent only, derives the hover, tint and label colour, and survives a scheme change.
- **In the styleguide**, the header has a **Theme** dropdown listing every theme with a light-and-dark colour chip, next to the custom accent picker, the Auto/Light/Dark control and the animation speed.

## The theme format

A theme is plain data, so it can live in a file, come from an API or be built in code:

```js
{
  id: 'ocean',          // required, a string; also set as data-volta-theme on <html>
  name: 'Ocean',        // optional, shown in pickers
  light: { '--v-accent': '#10798e', /* ... */ },
  dark:  { '--v-accent': '#23c6e7', /* ... */ }
}
```

`light` and `dark` map token names to CSS colour strings. **A token a theme leaves out keeps the stylesheet's value**, so a theme lists only what it changes (`ocean` sets four tokens per scheme). Either half may be left out.

The tokens a theme may set (`Theme.tokens`; the same list as the colours in `styles/_colors.scss`):

| Group | Tokens |
| --- | --- |
| Accent | `--v-accent`, `--v-accent-hover`, `--v-accent-subtle` (a tint for active rows), `--v-on-accent` (label on an accent button) |
| Page | `--v-color-base` and its steps `-more-subtle`, `-subtle`, `-less-subtle` (surfaces, then borders, then stronger borders) |
| Text | `--v-color-trim` and its steps `-more-subtle`, `-subtle`, `-less-subtle` |
| State | `--v-color-inactive`, `--v-color-danger`, `--v-color-danger-subtle`, `--v-color-success`, `--v-color-warning` |

`applyTheme` throws a message naming the problem for a missing `id`, an unknown token (a typo such as `--v-acent`) or a non-string value, and does nothing else when it throws.

Animation speed (`--v-anim-speed`, `--v-anim-ease`) is not part of a theme; it has its own setters (`Theme.setAnimationSpeed`).

## Replacing the theme

Pick whichever level fits; they stack.

1. **At runtime, from code.** Best for switchers, per-customer branding and themes fetched from a server.

   ```js
   import { Theme } from 'volta';

   Theme.applyTheme('sunset');               // a preset, by id
   Theme.applyTheme(await loadCustomerTheme());   // or any theme object
   Theme.resetTheme();                       // back to styles/_colors.scss
   ```

   To start a new theme, copy the `volta` preset in `components/themePreset.js`: it lists every token with the stock values. Edit what you want to change and delete the rest.

2. **In your own stylesheet, with no JavaScript.** Load a stylesheet after Volta's that sets the tokens. This is also the way to avoid a flash of the stock colours before JavaScript runs.

   ```css
   :root { --v-accent: #10798e; --v-accent-hover: #0c5f70; }
   :root[data-theme='dark'] { --v-accent: #23c6e7; }
   @media (prefers-color-scheme: dark) {
     :root:not([data-theme]) { --v-accent: #23c6e7; }
   }
   ```

   Values set by `Theme.applyTheme` are inline on `<html>`, so they win over a stylesheet.

3. **Change the defaults for everyone.** Edit `styles/_colors.scss` (the `:root` block and `dark-palette`). Update the `volta` preset in `themePreset.js` to match; `tests/themePreset.test.js` fails until they agree.

`Theme.getTheme()` returns the applied theme, and `<html data-volta-theme="ocean">` lets a stylesheet add a rule for one theme.

## Dark mode in component styles

A colour that comes from a token needs no dark rule: the token itself changes with the scheme. For the rare rule that must differ in dark mode, use `@include dark { ... }` from `styles/_mixins.scss`. It applies under an explicit `[data-theme='dark']` and, only while no scheme has been chosen, under the OS preference (`:root:not([data-theme])` inside `prefers-color-scheme: dark`). So `Theme.setColorScheme('light')` turns it off even on a dark OS.

Don't write `@media (prefers-color-scheme: dark)` in a component stylesheet: it follows the OS only and ignores the user's choice. `tests/darkMixin.test.js` compiles the mixin to check the selectors, and fails if a stylesheet other than `_colors.scss` and `_mixins.scss` uses that query.

## Adding a preset

Add an object to `presets` in `components/themePreset.js`. `tests/themePreset.test.js` checks every preset, so a new one is held to the same rules as the built-in ones, in both light and dark:

- the label on the accent (`--v-on-accent` on `--v-accent`): 4.5:1
- the accent as text, on the page and on its own tint (`--v-accent-subtle`): 4.5:1
- body text on the page: 7:1; secondary text: 4.5:1
- the three page steps get further from the page colour in order

These are the rules the built-in themes were generated against: for each hue, the accent's lightness was searched until all four contrast checks passed. A theme that changes the page colours must set the whole ladder (`base`, its three steps, `trim` and its three steps, `inactive`) so the steps stay in order.

## Presets

| Theme | id | Light accent | Dark accent | Page colours |
| --- | --- | --- | --- | --- |
| Volta | `volta` | `#4A90E2` | `#4A90E2` | stock (full template) |
| Ocean | `ocean` | `#10798e` | `#23c6e7` | stock |
| Forest | `forest` | `#207e3f` | `#3bce6c` | stock |
| Sunset | `sunset` | `#b34b0f` | `#f0884c` | stock |
| Rose | `rose` | `#c91d64` | `#eb70a3` | stock |
| Violet | `violet` | `#6e2fda` | `#a781e9` | stock |
| Amber | `amber` | `#9b6508` | `#f3a216` | stock |
| Berry | `berry` | `#b526b5` | `#e170e1` | stock |
| Indigo | `indigo` | `#2f3dda` | `#818ae9` | stock |
| Slate | `slate` | `#586c89` | `#8fa0b7` | tinted |
| Graphite | `graphite` | `#676d79` | `#9ca1ab` | stock |
| Sepia | `sepia` | `#946338` | `#ca9b72` | tinted |
| Midnight | `midnight` | `#087a91` | `#16cef3` | tinted |

`volta` is the stock theme and is deliberately not changed: its white-on-accent label is 3.3:1, below AA (tracked in `docs/backlog/resolve-contrast-failures.md`). The other twelve pass.

## API (`components/theme.js`, exported as `Theme`)

| Function | What it does |
| --- | --- |
| `applyTheme(themeOrId)` | Applies a theme object or a preset id. Replaces the previous theme and any custom accent. |
| `resetTheme()` | Removes the theme and any custom accent; back to `styles/_colors.scss`. |
| `getTheme()` | The applied theme, or `null`. |
| `setAccentColor(color)` / `resetAccentColor()` | A custom accent over the theme. Derives hover, tint (a lightened accent in light, the accent sunk into the page colour in dark) and a readable label colour. |
| `setColorScheme('light' \| 'dark' \| 'system')` / `getColorScheme()` | The scheme. `system` follows the OS and updates when it changes. |
| `setAnimationSpeed(ms \| '0.2s')` / `resetAnimationSpeed()` / `getAnimationSpeed()` | Global transition speed. |
| `presets`, `tokens` | The preset list and the list of settable tokens. |

Everything is applied by one function, `render()`, from three inputs (the theme, the scheme that is showing, the accent override), so any change to one of them keeps the others consistent.

## Who can change it

It runs in the browser, in whatever page loads the library; there is no server side and no permission model. Any code on the page can call `Theme`.

## Entry points

- Library: `import { Theme } from 'volta'`.
- Styleguide: the **Theme** dropdown in the header (`styleguide/views/ThemePicker.jsx`, used by `ThemeSwitcher.jsx`). It is a listbox: a button with `aria-haspopup`, arrow keys, Home/End, Enter or Space to choose, Escape to close, a click outside to close. On narrow screens the button shows just the colour chip.

## Tests

- `tests/theme.test.js`: applying by object and by id, light and dark halves, following the OS and its changes, removing tokens the next theme leaves out, reset, the custom accent over a theme and across a scheme change, the dark tint, the label colour, and the error messages.
- `tests/themePreset.test.js`: the token list equals the colours in `styles/_colors.scss` in both directions; `volta` equals the stylesheet; every preset is valid and meets the contrast rules in light and dark.
- `tests/ThemePicker/ThemePicker.test.jsx`, `tests/ThemeSwitcher/ThemeSwitcher.test.jsx`: the dropdown (roles, keyboard, outside click, per-theme colours) and that choosing a theme applies it.

## Known limits

- **Components with hard-coded colours don't follow a theme.** Two component stylesheets still have hex literals, `GlobalNav.scss` (a dark bar with fixed text colours) and `Loader.scss` (the animations' own colours), and they keep those colours in every theme. Everything else is built on the `--v-*` tokens (or the `$color_*` Sass aliases, which resolve to them) and follows fully. A hex literal in new code is a theming bug.
- **A flash of the stock colours is possible** when a theme is applied from JavaScript after first paint. Use a stylesheet (level 2 above), or apply the theme before first paint.
- **`setAccentColor` is only as accessible as the colour it is given.** It picks a readable label colour but doesn't check the accent against the page.
- The shadow, spacing, radius and type scales are not themeable.

## History

- Implemented 2026-11-05: `applyTheme`, `resetTheme`, `getTheme`, `presets`, `tokens`; the thirteen presets; per-scheme accent derivation; the styleguide Theme dropdown. Not committed or deployed when this was written.
- Checked 2026-11-05 (branch `backlog/fix-dark-mixin`): the `dark` mixin already honoured an explicit `data-theme`; the backlog task describing it as broken was stale. Added `tests/darkMixin.test.js` so it stays that way.
- Not verified: nothing was viewed in a browser, so the dropdown's appearance, its position in the wrapped header at mobile widths, and how each theme looks across the components are unchecked. The contrast figures come from a formula (tinycolor's WCAG readability), not from a visual check. The dropdown's behaviour is tested in jsdom only.
- Not implemented: remembering the chosen theme between visits; a theme editor in the styleguide; semantic colours (danger, success, warning) varying per preset; themeable shadows, radii and type.
