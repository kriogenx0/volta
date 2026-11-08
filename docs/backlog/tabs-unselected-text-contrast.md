---
priority: p2
components: [Tabs, TabsRouted, TabBar]
---

# Unselected tab labels are almost unreadable in light mode

`components/Tabs/Tabs.scss` colours a tab's label with `--v-color-base-less-subtle` (`#cccccc`) in light mode. On the white page that is **1.61:1**, where text needs 4.5:1. In dark mode it uses `--v-color-trim-subtle` and is fine (11.4:1). It is a text colour taken from the border-colour ladder, so it also doesn't follow the theme's text tokens.

## Requirements

- Colour the unselected label from a text token: `--v-color-trim-subtle` (8.5:1 on white in the stock palette) for both schemes, which makes the dark-mode override unnecessary.
- Keep the selected tab distinct (accent colour and underline). Selected-vs-unselected must not rely on colour alone: the underline already carries it.
- Check `TabsRouted` and `TabBar`, which are tab strips of their own, for the same colour.

## Acceptance criteria

- A test (read the stylesheet, as `tests/contrast.test.js` does for the token pairs) asserts the unselected tab text meets 4.5:1 on the page in light and dark.
- Checked in a browser in light and dark, under a non-default theme (`Theme.applyTheme('sepia')`).
