# Message

An inline status message: a short line of text that reports success or an error, or a plain note.

## When to use

- **A result or problem that belongs to a place on the page**, such as "Saved" under a form or a failed-save notice above it. `type="success"` and `type="error"` add an icon, a coloured edge and an ARIA role.
- Use [`ToastMessage`](../ToastMessage/README.md) for a transient notice that floats over the page, and [`ErrorMessage`](../ErrorMessage/README.md) for the error under one field.
- Use `ErrorList` (below) for several validation errors keyed by field name, such as an API error response.

## Usage

```jsx
import { Message, ErrorList } from 'volta';

<>
  <Message type="success" message="Your changes were saved." />
  <Message type="error">We could not reach the server. Try again.</Message>
  <ErrorList errors={{ email: ['Enter a valid email address.'], non_field_errors: 'Sign-in failed.' }} />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `type` | `'success'` \| `'error'` | | Picks the icon, colour and role. Missing or unknown shows a plain message with no role. `Message.typeDetails` holds the details. |
| `message` | `node` | | The text. `children` are shown when there is no `message`. |
| `children` | `node` | | The content, used when `message` is not given. |
| `role` | `string` | | Replaces the role the type gives. `null` leaves the role off, for a message that is described to a control instead of announced. |

The icon is a Font Awesome class (`fa fa-check-circle`, `fa fa-times-circle`) supplied by the host app and hidden from screen readers. Without Font Awesome loaded the icon is blank and the left border and the text still carry the state.

## ErrorList props

Renders a list of errors keyed by field name, such as a Django REST Framework error response. Each key becomes a bold, capitalized label; an array of strings for one field is joined into one line; `non_field_errors` is shown without a label.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `errors` | `object` | | Messages keyed by field name. With no `errors` the list is empty. |

## ErrorMessage

`ErrorMessage` is a `Message` of type `error` in its own component: see [`ErrorMessage`](../ErrorMessage/README.md).

## Accessibility

- `type="success"` has `role="status"` and `type="error"` has `role="alert"`, so a message inserted into the page after it loads is announced. Render it when the result arrives rather than hiding and showing it.
- State is not conveyed by colour alone: the text says what happened, and the icon and border back it up.
- `ErrorList` has no role. Put it in a region, or render it with a `role="alert"` wrapper, if it appears after a submit.

## Do and don't

- Do write what happened and what to do next ("Could not save. Check your connection and try again").
- Do render a `Message` only when there is something to say.
- Don't rely on the colour or the icon to carry the meaning; keep the text.
- Don't use a `Message` for a pop-up notice that disappears; use `ToastMessage`.
- Don't use `type="error"` for a hint; use plain text or `FieldHint` next to the field.
