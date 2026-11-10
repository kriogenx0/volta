# Tooltip

A short hint that appears beside an element on hover or keyboard focus.

## When to use

- **A short explanation of something that is already clear enough to use without it:** what a button's keyboard shortcut is, why something is disabled, the full text of a truncated label.
- Use [`PopOver`](../PopOver/README.md) or [`Drawer`](../Drawer/README.md) for content with links or buttons, [`Message`](../Message/README.md) or [`ErrorMessage`](../Message/README.md) for text everyone must see, and [`ToastMessage`](../ToastMessage/README.md) for a result that just happened.
- It wraps whatever you give it in an inline-block `<span>`. Without a `title` nothing is shown.

## Usage

```jsx
import { Tooltip, Button } from 'volta';

<Tooltip title="Copies the share link to your clipboard" gravity="down">
  <Button onClick={copyLink}>Share</Button>
</Tooltip>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string` | `null` | The hint text. Empty or missing, no tooltip is shown. Plain text only; it wraps at 200px. |
| `gravity` | `'up'` \| `'down'` \| `'left'` \| `'right'` | `'up'` | Which side of the element the tooltip sits on. `up` is above it. |
| `margin` | `number` | `8` | Gap in pixels between the element and the tooltip. |
| `className` | `string` | | Added to the wrapping `<span>`. |
| `children` | `node` | | The element the tooltip belongs to. |

Any other prop goes to the wrapping `<span>`. The tooltip has no delay and no arrow-key or Escape handling.

## Accessibility

- It shows on mouse over and when anything inside it receives focus, and hides on mouse out and blur, so keyboard users see it too. It is not dismissible with Escape.
- The popup has `role="tooltip"`, and the wrapping span (not the focused control inside it) gets `aria-describedby` while it is open. Don't count on that to name a control: an icon-only button still needs its own accessible name (`IconButton`'s `label`, or `aria-label`).
- Touch screens have no real hover, so don't count on the tooltip appearing there. Never put information the user needs only in a tooltip.
- The tooltip can't be hovered itself (`pointer-events: none`), and long text is cut into 200px lines, so keep it short.

## Do and don't

- Do keep `title` to a few words, and use it to add to a visible label, not replace one.
- Do put the tooltip on something focusable (a button, a link), so keyboard users can reach it.
- Don't put essential information, errors or links in a tooltip.
- Don't wrap an element that already shows the same text.
- Don't count on theming it: its colours are fixed (dark grey, white text) rather than theme tokens.
