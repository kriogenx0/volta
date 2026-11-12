# Dropdown

A button that reveals a floating panel of any contents below it.

## When to use

- **A panel of your own content under a button:** a few links, a small filter form, account details.
- **Choosing one option from a list** is [`DropdownList`](../DropdownList/README.md), which is built on `Dropdown`. A menu of actions is [`ActionMenu`](../ActionMenu/README.md). A form field that submits a value is [`NativeSelect`](../NativeSelect/README.md).
- A blocking decision or a larger form belongs in a [`Dialog`](../Dialog/README.md) or [`Drawer`](../Drawer/README.md).

## Usage

```jsx
import { Dropdown } from 'volta';

<>
  <Dropdown label="Account">
    <a href="/profile">Profile</a>
    <a href="/settings">Settings</a>
  </Dropdown>
  <Dropdown label="Filters" open={open} onClick={toggle} onClose={close}>
    <FilterForm />
  </Dropdown>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `open` | `bool` | | Leave it out and the dropdown opens and closes itself. Pass a bool and you control it: update it from `onClick` and `onClose`. |
| `label` | `node` | `null` | The text of the default trigger, shown with a chevron. |
| `buttonComponent` | `element` | | Your own trigger, instead of the default `Button`. You wire its click and `aria-expanded` yourself. |
| `children` | `node` | | The panel contents. The panel has no padding, so the contents set their own. |
| `className` | `string` | | Added to the root element. |
| `constrainWidth` | `bool` | `false` | Makes the panel as wide as the dropdown instead of as wide as its contents. |
| `onClick` | `function` | | Called when the default trigger is clicked. |
| `onClose` | `function` | `null` | Called when the dropdown closes: a click in the panel, a click on the overlay, or Escape. |
| `showOverlay` | `bool` | `false` | Dims the page behind the open panel (an `Overlay`); a click on it closes the dropdown. Off, the page is not dimmed and a press anywhere outside the dropdown closes it. |

Any other prop (`variant`, `size`, `disabled`, ...) goes to the default trigger `Button`. The panel stays in the DOM and is hidden with `display: none` until it opens.

## Accessibility

- The default trigger is a `Button` with `aria-haspopup="true"` and `aria-expanded` that follows the open state. A custom `buttonComponent` has to set both itself.
- Escape closes the open dropdown from anywhere on the page. When it closes, focus goes back to the trigger unless the user has already moved it outside.
- The panel follows the trigger in the DOM, so Tab continues into it. Arrow keys are not handled.
- Anything in the panel that can be pressed must be a native control or link, so it works from the keyboard.

## Do and don't

- Do give the trigger a label that says what is inside ("Account", not "Menu").
- Do control `open` and ignore `onClose` when the panel holds a form: any click inside the panel closes it.
- Don't turn `showOverlay` on for a plain menu: dimming the whole page for a small panel is heavy. It is for a dropdown that should feel like a blocking choice.
- Don't put essential navigation only in a dropdown.
- Don't restyle the panel colours with `className`; they come from the theme tokens.
