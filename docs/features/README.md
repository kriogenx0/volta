# Features

One doc per feature, as it exists in the code (see [docs/rules/feature-docs.md](../rules/feature-docs.md)). The component overview is in [docs/README.md](../README.md).

- [Accessible names](accessible_names.md): every button and link in every example must have a name for a screen reader; `ActionMenu`'s label.
- [Dependencies](dependencies.md): moment and lodash stay out of new code (a ratchet lists today's users), and the plan to remove them.
- [The styleguide](styleguide.md): what it shows, what the smoke test checks (every page and component, light and dark), and what it can't (how anything looks).
- [Interactive states](interactive_states.md): the keyboard and focus audit over every example, what it fixed (Tabs, FileUploader, VideoUploadPlayer), and what still needs a browser.
- [Date helpers](date_helpers.md): `Dater`, the date class behind the Calendar and DatePicker month grids; one copy in `util/`.
- [Theming](theming.md): replace the whole look with a theme object or a preset; light and dark; custom accent; the styleguide Theme dropdown.
- [Function components](function_components.md): every component is a function component with hooks except `Map`; how the conversions keep listeners and timers current; the test that stops new classes.
