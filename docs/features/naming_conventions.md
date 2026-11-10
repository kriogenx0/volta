# Naming conventions

How things are named in Volta, and the design principles every page and component is held to, written down as the **Naming** page of the styleguide (`make dev`, then Naming in the header, or `#naming` in the URL).

## What it says

- **Prefer the shorter name.** When two names mean the same thing, use the shorter one: `TextBox`, not `TextField`, because Box is shorter; `DatePicker`, not `DateInput`. The longer names stay exported as other names for the same component, so existing code keeps working.
- **One component, other names are aliases.** An alias is a constant pointing at the one implementation, never a copy (`TextField === TextBox`, `DateInput === DatePicker`, `Textarea` is `<TextBox multiline />`). A variant that changes how a component renders is a prop. Aliases are not listed as components in the styleguide.
- **Variants are props:** `<Button variant="primary" size="small">`, not new classes or components.
- **Names, files and folders:** PascalCase components; a component's folder, files and exports share its name (`components/TextBox/TextBox.jsx`, `examples/TextBox/TextBox-examples.jsx`); file names are singular.
- **Class names:** `volta-` root prefix (`view-` for a view), a single dash for inheritance or a relationship, two dashes for a modifier or state, underscores inside one term (`volta-textbox--sm`, `volta-text_editable`); no ids.
- **Docs and tasks:** backlog files are kebab-case and descriptive, feature docs are snake_case and named for the feature.
- **Design principles:** the 11 in `docs/rules/design-principles.md` (responsive on all devices, native controls look the same, only interactive things react to the cursor, global then app then view, 150ms animations, state changes never move an element, and so on) plus the Volta design system rules in `docs/project/design-system.md` (tokens not literals, one variable for two themes, reuse before you build, focus/hover/disabled states, WCAG 2.1 contrast).

## Where it lives

- `styleguide/views/Naming/conventions.js`: the text, as static data (`conventions`, `principles`, `systemRules`).
- `styleguide/views/Naming/Naming.jsx` and `Naming.scss`: the page. Its colours come from the theme tokens, so it follows light and dark without overrides. The cards use a "Prefer" / "Avoid" pair; the labels are words, not only colours.
- Registered as `Naming` in `styleguide/views/VoltaDocs.jsx`.

The conventions repeat rules from `docs/rules/` and `docs/project/design-system.md`; those files win if they disagree. A change to the shared rules is made in the agent-rules repo, not here.

## Tests

`tests/styleguideSmoke.test.jsx` opens the Naming page in light and dark with no errors, and checks that it states the short-name rule (TextBox preferred, TextField avoided) and lists the design principles.

## Known limits

- The page text and this doc are two copies; update both together. The page is data, not rendered from this file, because the repository has no Markdown renderer and no new tooling was added.
- The principles are a summary; the full wording is in `docs/rules/design-principles.md`.
- Not checked in a browser: the look of the page at desktop and mobile width.

## History

- 2026-11-10 (local, not merged or deployed): added the Naming page and this doc.
