# Modal

A dimmed backdrop with a centered panel for content that needs the user's attention.

## When to use

- **A focused task or detail** that sits on top of the page: a small form, a preview, a short explanation. You supply the content and the buttons.
- Use [`ModalDialog`](../ModalDialog/README.md) or [`Dialog`](../Dialog/README.md) for a panel that already has a title and OK or Cancel (Save) buttons, and [`Alert`](../ModalAlert/README.md) for a confirm or prompt. Use [`Drawer`](../Drawer/README.md) for a side form or detail.
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
| `show` | `bool` | | Whether it is open. Standalone form: open unless `false`. Container form: open only when `true`. |
| `title` | `node` | | Makes it the standalone form: a titled panel (an `<h2>`) with a close button. |
| `onClose` | `function` | | Standalone form (also chosen by giving `onClose`): called by the close button, a click on the backdrop and Escape. |
| `onHide` | `function` | | Container form: called by a click on the backdrop itself and by Escape. |
| `headerTitle` | `node` | | Container form: a header line above the content. A string also becomes the dialog's `aria-label`. |
| `className` | `string` | | Standalone form: added to the panel. Container form: added to the backdrop. |
| `children` | `node` | | The panel content. |

There are two forms. **Standalone** is used when `title` or `onClose` is given. **Container** is used when neither is given, and is what `ModalDialog` is built on. Other props go to the panel (standalone) or the backdrop (container). `Modal.inside` pads its children by 4rem on the left and right.

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
