# CloseButton

An icon-only "x" button that closes a panel, message or dialog.

## When to use

- **Dismissing the thing it sits on**: the corner of a message, a drawer, a popover or a card.
- Any other icon-only action is an [`IconButton`](../IconButton/README.md). An action with a word on it ("Cancel", "Done") is a [`Button`](../Button/README.md).
- [`Dialog`](../Dialog/README.md) already has its own close button; don't add a second one.

## Usage

```jsx
import { CloseButton } from 'volta';

<>
  <CloseButton onClick={dismiss} />
  <CloseButton aria-label="Close filters" onClick={closeFilters} />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `aria-label` | `string` | `'Close'` | The accessible name. Say what it closes when more than one close button is on the page. |
| `onClick` | `function` | | Called on click and on Enter or Space. |
| `disabled` | `bool` | | Native `disabled`: not focusable, no clicks, dimmed. |

It renders a `Button` with `variant="link"` and a `multiply` icon, and passes every other prop to it (`title`, `className`, `data-*`, ...).

## Theming

The icon is 30px and light-weight, in `--v-color-trim-less-subtle`, and goes to `--v-color-trim` on hover. The stylesheet overrides the link variant's accent colour for this button, so don't pass a `variant` expecting a different look.

## Accessibility

- It is a real `<button>`: Tab to reach it, Enter or Space to press it.
- The icon is hidden from assistive tech, and the button's name is `aria-label` ("Close" unless you change it).
- It has the `Button` focus ring (`:focus-visible`); hover only changes the icon colour.
- It does not close anything by itself and does not move focus. The code that closes the panel is responsible for putting focus somewhere sensible.

## Do and don't

- Do place it at the top right of what it closes, where people look for it.
- Do give it a specific `aria-label` when its container has a title ("Close filters").
- Don't use it for "Cancel" in a form; use a `Button` with the word.
- Don't make it the only way to close something that also needs Escape or an outside click; add those too (`Drawer` has both; `Dialog` has them with `closeOnOverlayClick`).
- Don't recolour it with `className`.
