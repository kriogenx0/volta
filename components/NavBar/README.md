# NavBar

The navigation bar at the top of an app: the app name on the left and a row of page links on the right. `GlobalNav` is another name for it.

## When to use

- **App-wide navigation at the top of every page.** One bar, with a handful of short links, the current one marked.
- A nested, expandable side navigation is [`NavSidebar`](../NavSidebar/README.md). Switching between views inside one page is [`Tabs`](../Tabs/README.md). A link to a route in the page body is [`Link`](../Link/README.md).

## Usage

```jsx
import { NavBar } from 'volta';

<NavBar
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
| `collapse` | `bool` | `true` | At 640px wide and below, fold the links behind a menu button that opens them as a list under the bar. `false` keeps the row at every width. |

If a `links` value is not a string (a route object, for example) the link has an empty `href`, and `onLinkClick` has to navigate. Without `links` nothing is rendered in the nav area.

## GlobalNav

`GlobalNav` is `NavBar` itself (`GlobalNav === NavBar`), kept for existing code. New code uses `NavBar`.

## Variants and states

- **Bar:** 48px tall, the page colour with a rule under it, so it follows light and dark mode. Links are the subtle text colour, the full text colour on hover, and the accent for the current page. They sit at the right with 40px of padding, or 20px below 1000px wide.
- **Collapsed (640px and below, `collapse` on):** the links leave the row and a menu button (three lines, or an X while open) takes the right end of the bar. It opens the links as a list under the bar, one 44px row each. Choosing a link, pressing Escape or pressing the button again closes it. This is the stylesheet's media query, so it follows the window width with no script reading it.
- **Open:** the list sits over the page with a shadow; the page does not move.

## Accessibility

- It renders a `<header>` with real anchors inside a `<nav>`, so links work with Tab and Enter. The current page is exposed with `aria-current="page"`, and also shown by a brighter link colour.
- The `<nav>` is named "Main". If the page has another navigation landmark, tell them apart in your own markup.
- The menu button is named "Menu", or "Close menu" while open, and has `aria-expanded` and `aria-controls` pointing at the links. It is only a control on a narrow screen. Escape closes the list.
- Each link is 48px tall (44px in the narrow list), so it is a comfortable touch target.

## Do and don't

- Do keep the links to the few top-level places in the app and mark the current one with `activeLinkKey`.
- Do pass `onLinkClick` when links are routes in a single-page app, and navigate from it.
- Don't use it for in-page actions; use `Button`.
- Don't turn `collapse` off unless the links fit a phone as a row.
- Don't try to recolour the bar with `className`; it takes none.
