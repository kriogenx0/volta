# Button

A button for an action: save, cancel, delete, open. A native `<button>` with Volta's variants and sizes.

## When to use

- **An action on the page.** Something happens when it is pressed. Use [`ActionLink`](../Link/README.md) or `Link` to go to another page, and `Toggle` for an on/off setting that applies immediately.
- **One `primary` per view region.** It is the main action; everything else is `default` or `link`.
- **`default`** for a secondary action, **`link`** for a low-emphasis one (toolbars, "Cancel" next to a primary), **`danger`** for a destructive one, behind a confirmation `Dialog`.
- An icon on its own with no text is an `IconButton`, not a `Button`.

## Usage

```jsx
import { Button } from 'volta';

<>
  <Button variant="primary" onClick={save}>Save</Button>
  <Button onClick={cancel}>Cancel</Button>
  <Button variant="danger" size="small" onClick={confirmDelete}>Delete</Button>
  <Button variant="primary" disabled>Saving…</Button>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `'default'` \| `'primary'` \| `'link'` \| `'danger'` | `'default'` | The look. `Button.variantTypes` lists them. |
| `size` | `'small'` \| `'large'` \| `'tiny'` | normal | `Button.sizes` lists them. |
| `disabled` | `bool` | `false` | Native `disabled`: not focusable, no clicks, dimmed. |
| `label` | `string` | | The text, instead of `children`. `children` is used when `label` is not given. |
| `className` | `string` | | Added to the button's classes. |
| `onClick` | `function` | | Called on click and on Enter or Space. |
| `type` | `string` | `'button'` | The native `type`. Use `'submit'` for the submit button of a form. |
| `children` | `node` | | The content. |

Any other prop is passed to the `<button>` (`aria-label`, `title`, `data-*`, ...). `full` makes the button fill its row. `bsStyle` and `tiny` are legacy spellings of `variant` and `size="tiny"`, kept for the pages that still use them; new code uses `variant` and `size`.

## Accessibility

- It is a real `<button>`, so it is reachable by Tab and operable by Enter and Space with no extra code.
- A visible label is its accessible name. A button whose content is only an icon needs `aria-label`.
- A `link` button is still announced as a button; don't use it to navigate.
- State is not shown by colour alone: `disabled` also dims the label and stops the pointer.

## Do and don't

- Do give every button text that says what it does ("Save changes", not "OK").
- Do keep to one `primary` per region.
- Don't put a `danger` button next to the main action without a confirmation step.
- Don't use a `Button` to navigate; use `Link`.
- Don't set the colour with `className`; use a `variant`. The accent and both themes come from the theme tokens.
