# Loader

A centered animation, with an optional message, for content that is still loading.

## When to use

- **A section or page that is waiting on data**, with nothing useful to show yet. Pass `message` to say what is loading.
- Use `size="tiny"` with `inline` for a spinner next to text or inside a control, and `size="small"` inside a card or pane.
- Use [`ProgressBar`](../ProgressBar/README.md) when you know how far along the work is, or for a thin loader pinned to the top of the window. For a short-lived confirmation use [`ToastMessage`](../ToastMessage/README.md).

## Usage

```jsx
import { Loader } from 'volta';

<>
  <Loader message="Loading projects..." />
  <Loader size="small" variant="bars" />
  <Loader tiny inline />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `size` | `'page'` \| `'small'` \| `'large'` \| `'tiny'` | `'page'` | `Loader.sizes` lists them. `page` adds generous vertical margin. |
| `variant` | `'spinner'` \| `'bars'` \| `'clock'` \| `'knob'` \| `'spin'` \| `'block'` | `'spinner'` | The animation. `Loader.variants` lists them. |
| `small` | `bool` | `false` | Shorthand for `size="small"`; overrides `size`. |
| `tiny` | `bool` | `false` | Shorthand for `size="tiny"`; overrides `size` and `small`. |
| `inline` | `bool` | `false` | Lays the loader out inline instead of as a block. |
| `message` | `node` | | Text shown under the animation. |

## Sizes

Only the default `spinner` changes its diameter with `size`: 80px for `page` and `large`, 30px for `small`, 15px for `tiny`. `tiny` is also inline with no margin. `large` has no size styles of its own: it draws like `page` without the extra margin. The other variants keep their own fixed size.

## Accessibility

- The animation is decorative and the loader sets no `role` or `aria-live`, so screen readers are told nothing by it. Give `message` text, and where the result matters announce it yourself (for example with a `role="status"` region around the loader).
- The loader is not focusable and its text cannot be selected.
- It does not stop for `prefers-reduced-motion`. Keep it short-lived and replace it with the content or an `Empty` state when loading ends.

## Do and don't

- Do show a loader only while the user is waiting, and replace it as soon as there is something to show.
- Do say what is loading in `message` for waits that might be long.
- Don't stack several page-size loaders on one screen; use one per region, or `small` or `tiny`.
- Don't use a loader for work with a known length; use [`ProgressBar`](../ProgressBar/README.md).
- Don't try to recolour it; it takes no `className` and each variant carries its own colours.
