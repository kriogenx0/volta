# ClipboardHover

Wraps some text and shows a small copy button over it while the pointer is on it.

## When to use

- **A value people copy often with a mouse**: an ID, a token, an address, a command, in a table or a detail view.
- It copies exactly the text inside it (`textContent`), not the markup.
- For a button that always shows, with its own label, use a [`Button`](../Button/README.md) and copy in your own handler. For code samples use [`Code`](../Code/README.md).

## Usage

```jsx
import { ClipboardHover } from 'volta';

<ClipboardHover>example-api-token</ClipboardHover>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `node` | | What is shown and copied. Whatever text it renders is the copied value. |

There are no other props: the wrapper takes no `className` and no handler.

## Behaviour

- The copy button (a tiny `Button` with a clipboard icon) sits at the top right and is hidden until the pointer is over the wrapper.
- Clicking it writes the wrapper's text to the clipboard with `navigator.clipboard.writeText`. Browsers only offer that on secure pages (HTTPS or localhost).
- There is no confirmation after copying and no message if the copy fails.

## Accessibility

- The copy button is `display: none` until the wrapper is hovered, so keyboard and touch users cannot reach it. Do not make it the only way to get the value.
- The button holds only an icon and has no `aria-label`, so it has no accessible name.
- Because the change is on hover alone, nothing tells a user that the text can be copied until they point at it.

## Do and don't

- Do show the same value somewhere the keyboard and phones can reach: a visible "Copy" `Button`, or selectable text.
- Do keep the wrapped content short and single-purpose, so what is copied is what is seen.
- Don't wrap long or mixed content; the whole text is copied, including text that is visually hidden.
- Don't rely on it for anything that only touch users will see.
- Don't wrap links or buttons; the copy button sits over the top right corner of the wrapper.
