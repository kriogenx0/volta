# ErrorText

The red helper text for a validation error, shown directly under the control it belongs to.

## When to use

- **A field-level error** such as "Enter a valid email address.", right under the field. `TextField` already shows one for you when you give it an `error`, so use `ErrorText` directly only for controls that have no `error` prop of their own.
- A success or error after submitting a whole form is a [`Message`](../Message/README.md), which is announced to screen readers. A list of server errors keyed by field is [`ErrorList`](../Message/README.md).
- A label that says a field is optional is [`FieldLabel`](../FieldLabel/README.md).

## Usage

```jsx
import { ErrorText } from 'volta';

<>
  <ErrorText message="Enter a valid email address." />
  <ErrorText message={<>Password needs <strong>at least 8 characters</strong>.</>} />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `message` | `node` | | The text, or a little markup such as `<strong>` for emphasis. |

It renders a `<p>` in `--v-color-danger` at 14px with no margin, so the surrounding layout sets the spacing. It takes no `className` or other props.

## Accessibility

- It is not a live region, so a screen reader does not announce it when it appears. `ErrorText` has no `id` prop, so wrap it in an element with an id and point the control's `aria-describedby` at it, with `aria-invalid` on the control while the error shows. `TextField` does exactly this for its `error`.
- The message is text, so the error is not carried by the red alone. Write it so it still makes sense without the colour ("Enter a valid email address", not "Invalid").

## Do and don't

- Do say what is wrong and how to fix it, in a sentence.
- Do show it only while the error exists, and remove it when the field is valid.
- Don't show an error by colouring the field alone; always include the message text.
- Don't put it far from its field, or use it for a message that isn't an error. Use `Message` for a form-level result.
- Don't style the colour yourself; it comes from the `danger` token in both themes.
