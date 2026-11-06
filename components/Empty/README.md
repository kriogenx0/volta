# Empty

A large, centred, muted message for a place that has nothing to show yet: no results, no files, no items.

## When to use

- **An empty list, table or panel.** Say what is missing and, if there is one, what to do next ("No files uploaded yet. Drag and drop to get started.").
- A success or error message after an action is a [`Message`](../Message/README.md).
- Something still loading is a [`Loader`](../Loader/README.md), not an empty state.

## Usage

```jsx
import { Empty } from 'volta';

<Empty>No results found.</Empty>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `node` | | The message. It has no other props. |

The text is centred at 150% of the surrounding size, with 100px of space above and below, in a faint grey (`--v-color-base-less-subtle`; `--v-color-trim` in dark mode). `Empty.jsx` also exports `EmptyState`, a smaller 14px message centred in at least 55% of the viewport height; it is not exported from `volta`.

## Accessibility

- It is a plain `div` with text: no role, and it is not announced when it appears. If the list changes in response to a search or filter, announce the result elsewhere (for example a live region).
- The faint light-mode grey is below the 4.5:1 contrast for body text. Don't rely on it for essential instructions; put the next step in a visible `Button` or link.

## Do and don't

- Do write the message as a sentence that says what is missing.
- Do offer the next step ("Add a file") next to it when there is one.
- Don't show it while data is still loading; show a `Loader` first.
- Don't use it for an error. Use `Message`, or `ErrorText` next to a field.
- Don't change its size or colour with `className` (it takes none); wrap it if it needs to sit in a layout.
