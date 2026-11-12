# The styleguide

The styleguide is the app in `styleguide/` (Vite, `make dev` or `make up`): a shell with eight pages (Home, Components, Examples, Icons, Colors, Type, Layout, Naming), the live examples for every component, and header controls for the theme, light or dark, a custom accent and the animation speed.

## What it shows

- **Components**: opens on an overview of every component, a tile for each (its name, the first sentence of its description, and a live, non-interactive preview of its first example that renders once the tile is near the screen), grouped as the sidebar is; the "All Components" item at the top of the sidebar (the sidebar is the `SideBarList` component) comes back to it, and the search filters it. Then a sidebar of every component by group (`styleguide/views/ComponentExamples/componentGroups.js`) and, for the chosen one, its description and each example, live next to its code. An example that throws is replaced by a "Couldn't render" box instead of taking the page down.
- **Icons**: a tile for every icon the library draws as SVG, a search (by any of an icon's names, so "close" finds the X), and for the chosen one a large preview, its two sizes, how to use it and the other names it answers to (`styleguide/views/Icons/`).
- **Examples** (`/examples`): whole screens built from Volta components, to see how they fit together: Login, Signup, Dashboard, List, Table and Settings, chosen from a sidebar (a `SideBarList`). They are made-up and local: forms don't send anything, the data is static (`styleguide/views/Examples/examples-data.js`), and they follow the theme, shape, light and dark like any page built on Volta. They have light behaviour so they can be tried: Login asks for the password and the two auth pages link to each other, Signup keeps its button off until the terms are agreed, List filters as you type and has an empty state, Table is a real `<table>` filtered by tabs, Settings has tabs, switches and a confirmed delete. Covered by `tests/ExamplesPage.test.jsx` and the smoke test; not checked in a browser, so layout at 375px is unverified.
- **Naming**: the naming conventions and design principles ([Naming conventions](naming_conventions.md)).
- **The current page** is kept in the URL path (`/components`; old `#components` links are moved into the path), so a refresh, the back button and a pasted link open the same page.
- **Header**: the page switcher (a `SegmentedControl` in `navigation` mode whose highlight slides to the chosen page), the **Theme** dropdown (`docs/features/theming.md`), a custom accent, Auto / Light / Dark and the shape. (The animation speed slider that used to be here is gone; `Theme.setAnimationSpeed` is still there, and the Slider examples have an animation speed demo.)
- A new component needs its examples in `examples/<Name>/<Name>-examples.jsx`, registered in `styleguide/views/ComponentExamples/components.jsx` and listed in a group in `componentGroups.js`.

## What is tested

`tests/styleguideSmoke.test.jsx` renders the whole styleguide in light and in dark and checks that:

- the shell renders, with its navigation and the Theme dropdown, and `data-theme` is the scheme asked for;
- every page opens with content and no error;
- every component in the sidebar opens, with the right heading and all of its examples, and none fell back to the "Couldn't render" box (the error boundary hides these from the console, so the test looks for the box);
- Home and Colors render under every theme preset;
- nothing logs a React error on the way.

It also checks the sidebar's data, which fails silently otherwise: every component that has examples is listed in a group (or it is invisible), no group names a component that doesn't exist (the sidebar skips unknown names without a word, so a typo hides one), and each is listed once. It found five dead names (`BaseInput`, `FormRow`, `ListHeader`, `FilterSectionListItem`, `ListCardRow`: sub-components covered by their parents' examples), which were removed from the groups.

Together with `tests/examples.test.jsx` (every example renders cleanly, with no React warning), this is what keeps the styleguide from breaking quietly.

## Not tested

- **How anything looks.** jsdom has no CSS and draws nothing, so this is a smoke test, not a visual regression test: a restyle that breaks the layout, or a component that renders blank, passes it. Comparing screenshots in light and dark needs a real browser and tooling the repository doesn't have (`docs/backlog/add-styleguide-smoke-test.md`).
- The mobile layout of the header and the sidebar.

## History

- 2026-11-06 (branch `backlog/add-styleguide-smoke-test`, not merged or deployed): the smoke test, and the dead sidebar names removed.
