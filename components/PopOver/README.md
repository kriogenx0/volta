# PopOver

A panel of your content shown over the page while `open`, over a backdrop that closes it on a click or Escape.

## When to use

- **A transient panel you design yourself**: a filter box, a quick form, a menu. By default it covers the window with a translucent backdrop and shows the content on it; with `fullSize={false}` the content stays where it sits in the page.
- Use [`Modal`](../Modal/README.md), [`ModalDialog`](../ModalDialog/README.md) or [`Dialog`](../Dialog/README.md) for a dialog that has its own panel, title and buttons (`Dialog` is built on `PopOver`), [`Dropdown`](../Dropdown/README.md) or [`ActionMenu`](../ActionMenu/README.md) for a menu from a button, and [`Tooltip`](../Tooltip/README.md) for a hover hint.
- The parent owns the open state: set `open`, and clear it in `handleClose`.

## Usage

```jsx
import { PopOver, Button } from 'volta';

<>
  <Button onClick={() => setOpen(true)}>Filters</Button>
  <PopOver open={open} handleClose={() => setOpen(false)} aria-label="Filters">
    <p>Choose what to show.</p>
    <Button onClick={() => setOpen(false)}>Done</Button>
  </PopOver>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `open` | `bool` | `false` | Shows the popover. |
| `fullSize` | `bool` | `true` | `true` covers the window with a backdrop. `false` keeps the content in place, over a faint full-window click-catcher. |
| `closeOnOverlayClick` | `bool` | `true` | A click outside the content and Escape call `handleClose`. `false` leaves closing to controls you add. |
| `handleClose` | `function` | `null` | Called when the popover asks to close. It never closes itself. |
| `className` | `string` | `null` | Added to the root. |
| `children` | `node` | | The content. |
| `aria-label` | `string` | | Names the dialog. |
| `aria-labelledby` | `string` | | The id of an element that names the dialog, as an alternative to `aria-label`. |

It is always in the DOM and hidden with CSS while closed, so its children stay mounted and keep their state. It draws only the backdrop: the content has no panel, border or background of its own, so style it (a [`Card`](../Card/README.md) works).

## Accessibility

- The root is `role="dialog"` with `tabIndex="-1"`, and the content is wrapped in a `role="document"`. Give it `aria-label` or `aria-labelledby` so it has a name.
- Escape and a click on the backdrop call `handleClose` while `closeOnOverlayClick` is on. With it off, include a visible close control.
- It does not set `aria-modal`, trap Tab or move focus in or back, so focus can still reach the page behind it. Move focus to the first control yourself when it opens.

## Do and don't

- Do name it, and give the content a visible close or Done control.
- Do clear your open state in `handleClose`, or the popover will stay open.
- Don't rely on the backdrop and Escape as the only way out of a form with unsaved input; set `closeOnOverlayClick={false}` and offer Cancel.
- Don't use it for a short hint; use a `Tooltip`.
