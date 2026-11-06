# GlobalNav

The top bar of an app: the app name on the left and a row of page links on the right.

## When to use

- **App-wide navigation at the top of every page.** One bar, with a handful of short links, the current one marked.
- A nested, expandable side navigation is [`NavBar`](../NavBar/README.md). Switching between views inside one page is [`Tabs`](../Tabs/README.md) or [`TabBar`](../TabBar/README.md). A link to a route in the page body is [`Link`](../Link/README.md).

## Usage

```jsx
import { GlobalNav } from 'volta';

<GlobalNav
  appName="My App"
  appSubtitle="Beta"
  links={{ Home: '/', Dashboard: '/dashboard', Reports: '/reports' }}
  activeLinkKey="Dashboard"
  onLinkClick={(link, key) => goTo(link, key)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `links` | `object` | | `{ 'Title': url }`. The key is the visible text and the React key, so it must be unique; the value is the `href` when it is a string. |
| `activeLinkKey` | `any` | | The key of the current page. That link gets the `active` class and `aria-current="page"`. |
| `onLinkClick` | `function` | | Called with `(link, key)`. When it is set, every link click is cancelled (`preventDefault`) and handed to it, including string urls, so you can route in the app. |
| `appName` | `string` | | The app name, shown as a link to `homeLink`. Without it the left side is empty. |
| `appSubtitle` | `string` | | Small text after the app name, such as "Beta". Only shown with `appName`. |
| `homeLink` | `string` | `'/'` | Where the app name goes. It is never intercepted by `onLinkClick`. |

If a `links` value is not a string (a route object, for example) the link has an empty `href`, and `onLinkClick` has to navigate. Without `links` nothing is rendered in the nav area.

## Variants and states

The bar is 48px tall with a fixed dark grey background and white text in both light and dark themes; it is not coloured from the theme tokens. Links sit at the right with 40px of padding, or 20px below 1000px wide. There is no narrow-screen layout of its own, so keep the links few and short.

## Accessibility

- It renders a `<header>` with real anchors inside a `<nav>`, so links work with Tab and Enter. The current page is exposed with `aria-current="page"`, and also shown by a brighter link colour.
- The `<nav>` has no label. If the page has another navigation landmark, tell them apart in your own markup.
- Each link is 48px tall, so it is a comfortable touch target. The links do not wrap or collapse, so check them at 375px wide.

## Do and don't

- Do keep the links to the few top-level places in the app and mark the current one with `activeLinkKey`.
- Do pass `onLinkClick` when links are routes in a single-page app, and navigate from it.
- Don't use it for in-page actions; use `Button`.
- Don't add more links than fit on a phone; there is no overflow menu.
- Don't try to recolour the bar with `className`; it takes none.
