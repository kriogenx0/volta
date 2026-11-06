# ModalDialog

A modal dialog with an optional title, a body for your content, and OK and Cancel buttons.

## When to use

- **A short task with a clear yes or no**: edit a name, confirm settings, fill in a few fields. The dialog supplies the title, the buttons and the layout; you supply the body.
- Use [`Alert`](../ModalAlert/README.md) for a one-line confirm or prompt, [`Dialog`](../Dialog/README.md) for the Save and Cancel flavour, [`Modal`](../Modal/README.md) when you want to lay the whole panel out yourself, and [`Drawer`](../Drawer/README.md) for a longer side form.
- It opens with `isOpen` and closes itself on OK, Cancel, the X, the backdrop or Escape, after calling your callback. Update your own open state in `onOkay` and `onCancel` so you can open it again.

## Usage

```jsx
import { ModalDialog } from 'volta';

<ModalDialog
  isOpen={open}
  title="Invite a teammate"
  okayButtonLabel="Send invite"
  okayEnabled={email !== ''}
  closeX
  onOkay={() => { sendInvite(email); setOpen(false); }}
  onCancel={() => setOpen(false)}
>
  <p>They will get an email with a link to join.</p>
</ModalDialog>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `isOpen` | `bool` | `null` | Shows it when `true`. `null` keeps it closed. It opens again when `isOpen` changes to `true`. |
| `title` | `string` | `null` | Heading in the header (an `<h4>`). With no title there is no header. |
| `okayButtonLabel` | `string` | `'OK'` | Label of the primary button. |
| `cancelButtonLabel` | `string` | `'Cancel'` | Label of the Cancel button, which is always shown. |
| `okayEnabled` | `bool` | `true` | `false` disables OK. |
| `hideOkayButton` | `bool` | `false` | Leaves out the OK button, for dialogs that only inform. |
| `hideHeader` | `bool` | `false` | Hides the title and the X. |
| `closeX` | `bool` | `false` | Shows an X button in the header. Needs a `title` and `hideHeader` off. |
| `inlineMode` | `bool` | `false` | Shows it in the page flow instead of floating over it. |
| `closeOnOverlayClick` | `bool` | `true` | A click on the backdrop and Escape cancel. `false` leaves only the buttons. |
| `className` | `string` | | Added to the backdrop. |
| `children` | `node` | | The body. |
| `onOkay` | `function` | | Called by OK, then the dialog closes. |
| `onCancel` | `function` | | Called by Cancel, the X, the backdrop and Escape, then the dialog closes. |

## Accessibility

- It is a `Modal`, so the panel has `role="dialog"`. The title is a heading inside the panel, not the dialog's accessible name, so a screen reader announces an unnamed dialog. Make the first line of the body say what the dialog is for.
- The X is labelled "Close". OK and Cancel are real buttons, and OK is truly disabled when `okayEnabled` is `false`.
- Escape and the backdrop cancel while `closeOnOverlayClick` is on. It does not trap Tab, move focus in, or return it afterwards.

## Do and don't

- Do label OK for the action ("Send invite"), and keep Cancel as the way out.
- Do disable OK with `okayEnabled` until the form is valid, and say why next to the field.
- Don't leave your own open state `true` after a close; the dialog will not reopen until `isOpen` changes.
- Don't put a long form in it; use a `Drawer` or a page.
- Do turn off `closeOnOverlayClick` when a stray click or Escape would throw away typed input; the buttons stay as the way out.
