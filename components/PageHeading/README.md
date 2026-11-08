# PageHeading

The page title as an `<h1>`, with optional actions shown opposite it.

## When to use

- **At the top of a view**, once per page: the title on the left and the page's main actions (a "New project" button, a filter) on the right. On a narrow screen the actions wrap under the title.
- Use a plain heading inside a section, [`Card`](../Card/README.md) or [`Modal`](../Modal/README.md) title for anything below the page level; `PageHeading` always renders an `h1`.
- Put it inside [`PageWidth`](../PageWidth/README.md) to line it up with the page content.

## Usage

```jsx
import { PageHeading, Button } from 'volta';

<PageHeading text="Projects">
  <Button>Export</Button>
  <Button variant="primary" onClick={createProject}>New project</Button>
</PageHeading>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | `node` | | The title, rendered inside the `<h1>`. |
| `children` | `node` | | Actions shown opposite the title. They sit side by side with an 8px gap and wrap when there is no room. |

The root is a flex row with 16px of space above and below. It also carries `clearfix` and `l-*` layout classes for views that still style them; the stylesheet lays the two sides out with flex, so those classes do not change the layout.

## Accessibility

- The title is the page's `<h1>`, the top of the heading outline. Use one per page, and put the page title in `text`, not a section name.
- A view should also set its document title to match.
- Actions in `children` keep their own roles and keyboard behaviour; each needs its own accessible name.

## Do and don't

- Do keep the title short and the same as the navigation entry that leads to the page.
- Do put at most one `primary` button in `children`.
- Don't use `PageHeading` for several headings on a page; later headings are `h2` and below.
- Don't put long text or a form in `children`; it is for a few actions.
- Don't rely on the `l-l` and `l-r` classes in new code; the flex layout is the source of truth.
