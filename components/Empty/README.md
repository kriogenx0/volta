# Empty

A large, centred, muted message for a place that has nothing to show yet: no results, no files, no items.

## When to use

- **An empty list, table or panel.** Say what is missing and, if there is one, what to do next ("No files uploaded yet. Drag and drop to get started.").
- A success or error message after an action is a [`Message`](../Message/README.md).
- Something still loading: pass `loading` and the same component shows a [`Loader`](../Loader/README.md) with your message as its caption, then the message itself once it stops.

## Usage

```jsx
import { Empty } from 'volta';

<>
  <Empty>No results found.</Empty>
  <Empty icon="questionmark">We couldn't find that page.</Empty>
  <Empty loading={isLoading}>{isLoading ? 'Loading projects…' : 'No projects yet.'}</Empty>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `node` | | The message. While `loading` it is the loader's caption. |
| `loading` | `bool` | `false` | Shows a small `Loader` instead of the icon and message, with `role="status"` and `aria-busy`. |
| `icon` | `string` | | The name of a drawn icon to show large (4em) above the message: `questionmark` is a big question mark, and any name in the `Icon` grid works. |

The text is centred at 130% of the surrounding size in regular weight, with 100px of space above and below, in a soft muted colour (`--v-color-trim-less-subtle`, one token for light and dark). The icon is lighter still (`--v-color-base-less-subtle`). `Empty.jsx` also exports `EmptyState`, a smaller 14px message centred in at least 55% of the viewport height; it is not exported from `volta`.

## Accessibility

- It is a plain `div` with text: no role, and it is not announced when it appears. While `loading` it is `role="status"` with `aria-busy`, so the caption is announced; the loader's own animation is decorative. The icon is hidden from assistive technology. If the list changes in response to a search or filter, announce the result elsewhere (for example a live region).
- The soft grey is below the 4.5:1 contrast for body text. Don't rely on it for essential instructions; put the next step in a visible `Button` or link.

## Do and don't

- Do write the message as a sentence that says what is missing.
- Do offer the next step ("Add a file") next to it when there is one.
- Do pass `loading` while data is still loading, rather than showing "No results" first.
- Don't use it for an error. Use `Message`, or `ErrorMessage` next to a field.
- Don't change its size or colour with `className` (it takes none); wrap it if it needs to sit in a layout.
