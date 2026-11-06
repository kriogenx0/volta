# ActionLink

A quiet text link to another page of the app, routed on the client with React Router.

## When to use

- **Going to another page from a header, toolbar or card**, where a full [`Button`](../Button/README.md) would be too loud. It renders React Router's `Link`, so it has to be inside a router.
- Use [`Link`](../Link/README.md) for a plain `<a href>` (an address outside the router, or a path whose `:name` segments are filled from `params`).
- Use `Button` for something that does an action instead of going somewhere.
- Not for links in running text: it has no underline, so it is not recognisable as a link there without hovering over it.

## Usage

```jsx
import { ActionLink } from 'volta';

<>
  <ActionLink to="/settings">Settings</ActionLink>
  <ActionLink to={{ pathname: '/search', search: '?q=volta' }}>Search</ActionLink>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `to` | `string` \| `object` | | Required. A path, or a location object (`{ pathname, search, hash }`). |
| `className` | `string` | `''` | Added after the base class `volta-action_link`. |
| `children` | `node` | | The link text. |

Any other prop is passed to the `Link` (`aria-label`, `title`, `onClick`, ...).

## Theming

Text is `--v-color-trim-subtle` (14px, weight 500) and goes to `--v-color-trim` on hover. The focus ring uses `--v-accent`. Both themes follow the tokens; there is nothing to set per theme.

## Accessibility

- It is a real `<a href>`, reached by Tab and followed with Enter.
- The visible text is its accessible name. If the content is only an icon, pass `aria-label`.
- Keyboard focus shows a 2px accent outline (`:focus-visible`).
- Hover only changes the text colour; the link is still the same size and position.

## Do and don't

- Do write link text that says where it goes ("Account settings", not "Click here").
- Do use it for navigation only. For an action, use a `Button`.
- Don't put it inside a paragraph; use `Link` there, which has no styles of its own, so the page's normal link styles apply.
- Don't recolour it with `className`; the colours come from the theme tokens.
- Don't render it outside a router; it throws without one.
