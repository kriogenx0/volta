# Alert

A centered confirm or prompt dialog that asks the user to confirm, cancel or type a short answer.

## When to use

- **A blocking question** that needs an answer before going on: "Delete this project?", or a one-line prompt such as naming a saved view. It is the place to confirm a destructive action.
- Use [`ModalDialog`](../ModalDialog/README.md) or [`Dialog`](../Dialog/README.md) when the dialog holds a form or more content, [`Modal`](../Modal/README.md) for a panel you fill yourself, and [`ToastMessage`](../ToastMessage/README.md) for a notice that needs no answer.
- It is open while it is rendered, so the parent decides when: render it conditionally and remove it in `onConfirm` and `onCancel`.

## Usage

```jsx
import { Alert } from 'volta';

showDelete && (
  <Alert
    title="Delete this project?"
    message="The project and its files will be removed. This cannot be undone."
    confirmTitle="Delete"
    onConfirm={deleteProject}
    onCancel={closeAlert}
  />
);
```

```jsx
<Alert type="input" title="Name this view" confirmTitle="Save" onConfirm={(name) => saveView(name)} onCancel={closeAlert} />;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string` | | The heading. It is the dialog's accessible name. |
| `message` | `string` | | Text under the title; the dialog's accessible description. Left out when empty. |
| `type` | `'text'` \| `'input'` | `'text'` | `'input'` adds a text field, focused when the alert appears. |
| `confirmTitle` | `string` | `'Confirm'` | Label of the primary button. |
| `cancelTitle` | `string` | `'Cancel'` | Label of the other button. |
| `onConfirm` | `function` | no-op | Called with the field's text for `type="input"`, otherwise with `null`. |
| `onCancel` | `function` | no-op | Called by the cancel button and by Escape. |

## Accessibility

- It has `role="alertdialog"`, labelled by the title and described by the message. The text field is named by the message, or by the title when there is no message.
- Enter confirms and Escape cancels, from anywhere on the page, except that Enter on one of the alert's own buttons or links presses that button. A held-down key is ignored, and it acts on key press, so the Enter that opened it does not confirm it.
- It does not trap Tab or restore focus, and only `type="input"` moves focus into it. A click outside does not close it.
- Make `confirmTitle` say the action ("Delete", "Save"), not "OK".

## Do and don't

- Do put the question in `title` and the consequence in `message`.
- Do name the destructive action in `confirmTitle`, and keep one primary button (the confirm button is already `primary`).
- Don't use it for notices that need no answer; use `ToastMessage`.
- Don't leave it rendered after `onConfirm` or `onCancel`; it does not close itself.
- Don't ask for more than one short line; use a `ModalDialog` with a form.
