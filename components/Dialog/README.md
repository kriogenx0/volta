# Dialog

A titled panel over the page, with a body and Save and Cancel buttons, for a decision or a short form.

## When to use

- **A blocking step that needs the user's answer**: edit these details, confirm this change. Save and Cancel are built in.
- A yes/no question or a one-line prompt is an [`Alert`](../ModalAlert/README.md). A side form or detail that slides in from the edge of the page is a [`Drawer`](../Drawer/README.md). A message that does not need an answer is a `Message` or a `ToastMessage`.
- The lower-level pieces are `PopOver`, `Modal` and `ModalDialog`; reach for them only when Dialog's header and buttons do not fit.

## Usage

```jsx
import { Dialog } from 'volta';

<Dialog
  isOpen={editing}
  title="Edit profile"
  saveEnabled={isValid}
  handleSave={() => { saveProfile(); setEditing(false); }}
  handleClose={() => setEditing(false)}
>
  <ProfileForm />
</Dialog>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `isOpen` | `bool` | `false` | Opens the dialog. See Behaviour for reopening. |
| `title` | `string` | `null` | Heading in the header. With no `title` (or `hideHeader`) there is no header and no close "x". |
| `titleSave` | `string` | `'Save Changes'` | Label of the Save button; `'Confirm'` in a confirmation. |
| `titleCancel` | `string` | `'Cancel'` | Label of the Cancel button. |
| `saveEnabled` | `bool` | `true` | When `false`, Save is disabled. |
| `hideSaveButton` | `bool` | `false` | Leaves only Cancel, for a dialog that just informs. |
| `hideHeader` | `bool` | `false` | Hides the header, with its title and close button. |
| `inlineMode` | `bool` | `false` | Shows the panel in the page flow instead of floating over it. |
| `variant` | `'form'` \| `'confirmation'` | `'form'` | `'confirmation'` is a short question with Confirm and Cancel: narrower, no header X, an alert dialog described by its text, with focus on Cancel so Enter never confirms by accident. `Dialog.variants` lists them. |
| `danger` | `bool` | `false` | Makes the Save or Confirm button the danger red, for a destructive choice. |
| `autoClose` | `bool` | `true` | Save, Cancel and the X also close the dialog. Off, only the parent closes it, by no longer rendering it (this is how `Alert` uses it). |
| `showCloseButton` | `bool` | `true` | The X in the header (never shown in a confirmation). |
| `closeOnOverlayClick` | `bool` | `false` | A click outside the panel, and Escape, close the dialog. |
| `className` | `string` | | Added to the root. |
| `children` | `node` | | The body. |
| `handleSave` | `function` | | Called when Save is pressed. |
| `handleClose` | `function` | | Called by Cancel, the header close button, and (with `closeOnOverlayClick`) a click outside or Escape. |

## ModalDialog

`ModalDialog` is a `Dialog` under older names, kept for existing code: `okayButtonLabel` and `cancelButtonLabel` (`'OK'` and `'Cancel'`), `okayEnabled`, `hideOkayButton`, `onOkay` and `onCancel` for the save and close handlers, and `closeX` for the header X. A click outside and Escape cancel by default (`closeOnOverlayClick` is on), where a `Dialog` ignores them unless asked.

## Behaviour

- Save, Cancel and the header "x" each call their handler and then close the dialog on their own. The dialog follows `isOpen` only when it changes, so a parent that keeps its own open state must set it to `false` in `handleSave` and `handleClose`; otherwise the next `isOpen={true}` is not a change and the dialog stays shut.
- The Save button is always `primary`. There is no danger variant; for a destructive confirmation set `titleSave` to the verb ("Delete").
- The panel is at most 32rem wide and scrolls inside itself when it is taller than the window. A wash of the page colour covers the page behind it.

## Accessibility

- The root is `role="dialog"`. When there is a header it is named by the title through `aria-labelledby`; without a title it has no accessible name, and Dialog takes no `aria-label`, so keep a `title`.
- The header close button is named "Close" and comes first in the tab order. The buttons are real `Button`s.
- Escape closes it only with `closeOnOverlayClick`.
- It does not move focus into the dialog when it opens, does not trap focus, and does not return focus on close. Keyboard users can still Tab to the page behind it; plan for that (for instance by focusing the first field yourself).

## Do and don't

- Do always give it a `title`.
- Do label the buttons with the action ("Delete project", not "OK") and update your open state in both handlers.
- Don't open a dialog from inside another.
- Don't use it for a message that does not need an answer; use a `Message` or `ToastMessage`.
- Don't put a long form or a multi-step flow in it; use a `Drawer` or a page.
