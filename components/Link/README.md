# Link

A plain anchor to another page, with Volta's link class and `:name` route parameters filled in from an object.

## When to use

- **Going to another page or URL.** Use [`Button`](../Button/README.md) for an action that happens on the current page.
- It renders a normal `<a href>`, so pressing it loads the page. It is not a router link and does not navigate client-side. For in-app routing with react-router use [`ActionLink`](../ActionLink/README.md).
- Use `params` when the path comes from a route pattern (`/users/:id`) and you have the values in an object.

## Usage

```jsx
import { Link } from 'volta';

<>
  <Link to="/projects">Projects</Link>
  <Link to="/users/:id/posts/:postId" params={{ id: 42, postId: 7 }}>Post 7</Link>
  <Link to="https://example.com" target="_blank" rel="noreferrer">Example</Link>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `to` | `string` | required | The path or URL, used as the `href`. `:name` segments are replaced from `params`. |
| `params` | `object` | | Values for the `:name` segments of `to`. Names match whole words and ignore case, so `:ids` is not touched by an `id` param. |
| `className` | `string` | | Added after `volta-link`. |
| `children` | `node` | | The link text or content. |

Any other prop (`target`, `rel`, `onClick`, `aria-label`, `data-*`, ...) is passed to the `<a>`. Param values are inserted exactly as given, not URL-encoded, so encode them first when they can contain `/`, `?` or `#`. `Link` has no stylesheet of its own: it takes the page's anchor styles.

## Accessibility

- It is a real link: reachable by Tab, activated by Enter, announced as a link.
- The link text is its accessible name. Say where it goes ("Project settings", not "Click here"). A link that holds only an icon needs `aria-label`.
- With `target="_blank"` also set `rel="noreferrer"`, and say in the text that it opens a new tab.

## Do and don't

- Do use real URLs in `to` so links work when opened in a new tab or copied.
- Do use `Link` for navigation and [`Button`](../Button/README.md) for actions.
- Don't use `Link` with `onClick` and a `#` target to run code; that is a button.
- Don't colour it with `className`; link colour and the accent come from the theme tokens.
- Don't expect it to keep a single-page app's state: it reloads the page.
