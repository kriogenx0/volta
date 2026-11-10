# ErrorMessage

An error as a card in the error colour: a tinted red background, a red edge and a red icon, with the text. `ErrorText` is another name for it.

## When to use

- **A field-level error** such as "Enter a valid email address.", right under the field. `TextBox`, `NativeSelect`, `Field` and `FieldRow` already show one for you when you give them an `error`, so use `ErrorMessage` directly only for controls that don't.
- A success or error after submitting a whole form is a [`Message`](../Message/README.md); `ErrorMessage` is that same card with the error type already set. A list of server errors keyed by field is [`ErrorList`](../Message/README.md).
- A label that says a field is optional is [`FieldLabel`](../FieldLabel/README.md).

## Usage

```jsx
import { ErrorMessage } from 'volta';

<>
  <ErrorMessage message="Enter a valid email address." />
  <ErrorMessage message={<>Password needs <strong>at least 8 characters</strong>.</>} />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `message` | `node` | | The text, or a little markup such as `<strong>` for emphasis. |
| `children` | `node` | | The content, used when `message` is not given. |
| `role` | `string` | `'alert'` | Replaces the alert role. `null` leaves it off. `TextBox`, `NativeSelect`, `Field` and `FieldRow` pass `null`, because the error is tied to the control with `aria-describedby`, and an alert that changed on every key press would be read out each time. |

It is a [`Message`](../Message/README.md) of type `error`, so it looks and behaves like one: 14px text, an 8px by 12px card with a 4px red edge and the error icon, using the theme's danger colours in light and dark. It takes no `className` or other props.

## ErrorText

`ErrorText` is `ErrorMessage` itself (`ErrorText === ErrorMessage`), kept for existing code from when it was bare red text. New code uses `ErrorMessage`.

## Accessibility

- By default it is `role="alert"`, so an error that appears after a submit is announced. Under a field, pass `role={null}` and point the control's `aria-describedby` at an element with the message's id (the library's fields do this).
- The error is not carried by colour alone: the text says what is wrong, and the icon and the edge back it up. Write it so it still makes sense without the colour ("Enter a valid email address", not "Invalid").

## Do and don't

- Do say what is wrong and how to fix it, in a sentence.
- Do show it only while the error exists, and remove it when the field is valid.
- Don't show an error by colouring the field alone; always include the message text.
- Don't put it far from its field, or use it for a message that isn't an error. Use `Message` for a form-level result.
