# ToastMessage

A brief notification in the top right corner, shown by calling a function: no component to render.

## When to use

- **Confirming something that just happened** without interrupting: "Changes saved", "Link copied", or a failed background action.
- Use [`Message`](../Message/README.md) for text that stays in the page (a form error, a banner), [`ErrorMessage`](../Message/README.md) under a field, and [`Dialog`](../Dialog/README.md) or [`Alert`](../ModalAlert/README.md) when the user must decide or acknowledge something.
- Don't put anything the user must act on in a toast; it goes away on its own.

## Usage

```jsx
import { ToastMessage } from 'volta';

ToastMessage.success('Changes saved');
```

## Methods

`ToastMessage` is an object of functions. The first toast mounts a container on `document.body`; every later one is stacked in it, newest on top.

| Method | Returns | Notes |
| --- | --- | --- |
| `ToastMessage.success(message, options)` | id | A toast with the success icon. `error`, `warning` and `info` work the same way. |
| `ToastMessage.show(message, options)` | id | The general form; `options.variant` picks the look. |
| `ToastMessage.dismiss(id)` | | Removes that toast straight away, without its leave animation. |

## Props

`ToastMessage` has no props; these are the `options` for each call, and `message` is the text (or any node) to show.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `'info'` \| `'success'` \| `'warning'` \| `'error'` | `'info'` | The icon and its colour. Set for you by `success`, `error`, `warning` and `info`. |
| `duration` | `number` | `4000` | Milliseconds before it leaves. `0` keeps it until the user dismisses it. |

## Accessibility

- Each toast is `role="status"`, a polite live region, and has a "Dismiss" close button that Tab reaches and Enter or Space press.
- The timer pauses while the pointer is over a toast and restarts on mouse leave. It does not pause on keyboard focus, so a keyboard user may lose a toast before reaching it.
- The variant is shown by an icon as well as colour, but the message must say it in words ("Could not save"), not rely on the icon.
- For an error or anything the user needs to read, pass `duration: 0` or use [`Message`](../Message/README.md).

## Do and don't

- Do keep the text to one short sentence, written as the outcome ("Changes saved").
- Do use `error` for a failed API call so it is not swallowed silently, and set `duration: 0` if there is no other trace of it.
- Don't use a toast for validation messages beside a field; use `error` on [`TextField`](../TextBox/README.md).
- Don't fire several at once for one action.
- Don't put buttons or links in a toast; it can disappear before they are used.
