# Tag

A small rounded label for a category, filter or keyword; optionally clickable, with an x for removing.

## When to use

- **Showing a category, keyword or active filter** next to content, or a removable item in a list of choices.
- Use [`Badge`](../Badge/README.md) with a `tone` for a status (success, warning, danger), [`TagInput`](../TagInput/README.md) to let people type their own tags, and [`Button`](../Button/README.md) for an action.
- Pass `onClick` to make the whole tag a button. Add `deletable` to show an x; it only adds the icon, so pair it with an `onClick` that removes the tag.

## Usage

```jsx
import { Tag } from 'volta';

<>
  <Tag>Design</Tag>
  <Tag onClick={() => toggleFilter('mobile')}>Mobile</Tag>
  <Tag deletable onClick={() => removeSkill('react')}>React</Tag>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `node` | | The label. |
| `deletable` | `bool` | `false` | Shows an x icon after the label. It doesn't remove anything itself. |
| `onClick` | `function` | | Makes the tag interactive: hover feedback, `role="button"`, in the tab order, Enter and Space call it. Receives the click event. |

There is no separate target for the x: a click anywhere on a `deletable` tag calls `onClick`.

## Accessibility

- Without `onClick` a tag is a plain `<span>`: not focusable, no role. With it, it gets `role="button"` and `tabindex="0"`, and Enter or Space press it.
- The x is `aria-hidden`, so a screen reader hears only the label, not that pressing the tag removes it. `Tag` passes no other props through, so say it in the surrounding text, such as a heading "Selected skills (press to remove)".
- The label text is the accessible name; keep it short and meaningful out of context.
- The text is not selectable and only clickable tags react to hover.

## Do and don't

- Do give a `deletable` tag an `onClick` that removes it, and show the result, or the x does nothing.
- Do keep tags to a word or two so they wrap cleanly on a narrow screen.
- Don't make a tag clickable and also put another control inside it.
- Don't use a tag for an action with consequences; use a [`Button`](../Button/README.md) with a confirmation.
- Don't recolour tags per category in a view's CSS; for status colours use a [`Badge`](../Badge/README.md) with a `tone`.
