# Modal

A dimmed backdrop with a centered panel for content that needs the user's attention, or with `fullSize={false}` a panel kept in place over a click-catcher. `PopOver` is another name for it.

## When to use

- **A focused task or detail** that sits on top of the page: a small form, a preview, a short explanation. You supply the content and the buttons.
- Use [`Dialog`](../Dialog/README.md) for a panel that already has a title and OK or Cancel (Save) buttons, and [`Alert`](../ModalAlert/README.md) for a confirm or prompt. Use [`Drawer`](../Drawer/README.md) for a side form or detail.
- Control it from the parent: render it with `show`, and close it in `onClose` or `onHide`. It never closes itself.

## Usage

```jsx
import { Modal, Button } from 'volta';

<>
  <Modal title="Rename project" show={open} onClose={() => setOpen(false)}>
    <p>Choose a new name for this project.</p>
    <Button variant="primary" onClick={save}>Save</Button>
  </Modal>
  <Modal show={detailsOpen} onHide={() => setDetailsOpen(false)} headerTitle="Details">
    <Modal.inside><p>Created by Alex on Jan 1.</p></Modal.inside>
  </Modal>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `open` | `bool` | | Another name for `show`; when both are given, `open` wins. |
| `show` | `bool` | | Whether it is open. Standalone form: open unless `false`. Container form: open only when `true`. |
| `title` | `node` | | Makes it the standalone form: a titled panel (an `<h2>`) with a close button. |
| `onClose` | `function` | | Standalone form (also chosen by giving `onClose`): called by the close button, a click on the backdrop and Escape. |
| `onHide` | `function` | | Container form: called by a click on the backdrop itself and by Escape. |
| `handleClose` | `function` | | Another name for `onHide` (and `onClose`): whichever is given closes it. |
| `closeOnOverlayClick` | `bool` | `true` | A click on the backdrop and Escape ask to close. Off, only your own buttons do (the standalone form's X still calls `onClose`). |
| `fullSize` | `bool` | `true` | The backdrop covers the window. `false` keeps the panel where it is in the page, over a faint click-catcher that closes it, as a light-dismiss layer; it is then not modal unless `modal` is set. |
| `modal` | `bool` | `fullSize` | Locks page scroll, traps Tab and returns focus on closing. |
| `role` | `string` | `'dialog'` | The panel's role; `'alertdialog'` for a question that needs an answer. |
| `aria-label` | `string` | | Names the panel. |
| `aria-labelledby` | `string` | | Id of the element that names the panel. |
| `aria-describedby` | `string` | | Id of the element that describes the panel. |
| `headerTitle` | `node` | | Container form: a header line above the content. A string also becomes the dialog's `aria-label`. |
| `className` | `string` | | Standalone form: added to the panel. Container form: added to the backdrop. |
| `children` | `node` | | The panel content. |

There are two forms. **Standalone** is used when `title` or `onClose` is given. **Container** is used when neither is given, and is what `Dialog` is built on. Other props go to the panel (standalone) or the backdrop (container). `Modal.inside` pads its children by 4rem on the left and right.

## PopOver

`PopOver` is `Modal` itself (`PopOver === Modal`), kept for existing code. Its names work on `Modal`: `open`, `handleClose`, `fullSize`, `closeOnOverlayClick` and the `aria-` props. One difference from the old `PopOver`: while closed `Modal` renders nothing, where `PopOver` kept a hidden element in the page.

## Accessibility

- The panel has `role="dialog"`. The standalone form is named by its `title` (`aria-labelledby`); the container form by `headerTitle` when it is a string. Always give one.
- Escape and a click on the backdrop call `onClose` or `onHide`, and the standalone close button is labelled "Close". Always wire up the handler so there is a way out.
- It does not set `aria-modal`, trap Tab, move focus into the panel or return it afterwards. Keep content short, and move focus yourself (for example to the first field) when it opens if the task needs it.

## Do and don't

- Do give every modal a visible title and a clear way out, and keep the primary action to one button.
- Do own the open state in the parent and clear it in `onClose` or `onHide`.
- Don't stack a modal over another modal.
- Don't put long pages or navigation inside it; the panel is at most 28rem wide and 85% of the window tall, and scrolls.
- Don't use it for a destructive confirmation on its own; use `Alert` or `Dialog`.
