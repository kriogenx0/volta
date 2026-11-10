# Link

A link to another page: a plain anchor by default, or a quiet routed link for headers and toolbars. `ActionLink` is another name for the quiet routed one.

## When to use

- **Going to another page or URL.** Use [`Button`](../Button/README.md) for an action that happens on the current page.
- By default it renders a normal `<a href>`, so pressing it loads the page. Add `router` to navigate on the client with React Router instead (it must then be inside a router).
- `variant="action"` is a quiet text link for a header, toolbar or card, where a [`Button`](../Button/README.md) would be too loud. Not for links in running text: it has no underline, so it is not recognisable as a link there without hovering over it.
- Use `params` when the path comes from a route pattern (`/users/:id`) and you have the values in an object.

## Usage

```jsx
import { Link } from 'volta';

<>
  <Link to="/projects">Projects</Link>
  <Link to="/users/:id/posts/:postId" params={{ id: 42, postId: 7 }}>Post 7</Link>
  <Link to="https://example.com" target="_blank" rel="noreferrer">Example</Link>
  <Link to="/settings" variant="action" router>Settings</Link>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `to` | `string` \| `object` | required | The path or URL, used as the `href`. `:name` segments are replaced from `params`. With `router` it can also be a location object (`{ pathname, search, hash }`). |
| `params` | `object` | | Values for the `:name` segments of `to`. Names match whole words and ignore case, so `:ids` is not touched by an `id` param. |
| `variant` | `'link'` \| `'action'` | `'link'` | `'link'` takes the page's own anchor styles. `'action'` is quiet: `--v-color-trim-subtle` text (14px, weight 500) that goes to `--v-color-trim` on hover. `Link.variants` lists them. |
| `router` | `bool` | `false` | Navigate with React Router's `Link` instead of loading the page. Throws outside a router. |
| `className` | `string` | | Added after `volta-link` (and `volta-link--action`). |
| `children` | `node` | | The link text or content. |

Any other prop (`target`, `rel`, `onClick`, `aria-label`, `data-*`, `replace`, `state`, ...) is passed to the `<a>`, or to React Router's `Link` with `router`. Param values are inserted exactly as given, not URL-encoded, so encode them first when they can contain `/`, `?` or `#`. The default look has no stylesheet of its own: it takes the page's anchor styles.

## ActionLink

`ActionLink` is `<Link variant="action" router />`: it takes the same props, and `to` is required. New code can write either; it is kept for existing code.

## Accessibility

- It is a real link: reachable by Tab, activated by Enter, announced as a link.
- The link text is its accessible name. Say where it goes ("Project settings", not "Click here"). A link that holds only an icon needs `aria-label`.
- With `target="_blank"` also set `rel="noreferrer"`, and say in the text that it opens a new tab.

## Do and don't

- Do use real URLs in `to` so links work when opened in a new tab or copied.
- Do keep keyboard focus visible: the action variant shows a 2px accent outline.
- Do use `Link` for navigation and [`Button`](../Button/README.md) for actions.
- Don't use `Link` with `onClick` and a `#` target to run code; that is a button.
- Don't colour it with `className`; link colour and the accent come from the theme tokens.
- Don't expect a plain `Link` to keep a single-page app's state: it reloads the page. Use `router`.
- Don't render a `router` link (or `ActionLink`) outside a router; it throws without one.
