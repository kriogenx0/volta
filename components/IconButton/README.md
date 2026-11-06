# IconButton

A borderless button that shows only an icon, with a required label that becomes its accessible name and tooltip.

## When to use

- **A compact action where the icon is clear**: add, edit, delete, favourite, in a toolbar or table row.
- An action with a text label is a [`Button`](../Button/README.md). A close "x" is [`CloseButton`](../CloseButton/README.md). An on/off setting is a [`Toggle`](../Toggle/README.md).
- A bare symbol that does nothing is an [`Icon`](../Icon/README.md).

## Usage

```jsx
import { IconButton } from 'volta';

const PlusIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M8 3v10M3 8h10" />
  </svg>
);

<IconButton icon={PlusIcon} label="Add item" onClick={addItem} />;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `icon` | `elementType` | | Required. A component, not an element. It is rendered as `<Icon size={size} />`, so it must accept a numeric `size`. |
| `label` | `string` | | Required. Becomes `aria-label` and the `title` tooltip. |
| `size` | `number` | `16` | Passed to the icon component, in pixels. |
| `variant` | `'ghost'` \| `'danger'` | `'ghost'` | `IconButton.variants` lists them. `danger` turns red on hover. |
| `className` | `string` | `''` | Added to the button's classes. |
| `type` | `'button'` \| `'submit'` \| `'reset'` | `'button'` | The native `type`. |

Any other prop goes to the `<button>`: `onClick`, `disabled`, `aria-pressed`, `data-*`. The library's own `Icon` can't be passed as `icon` directly, because it needs a `type` and its `size` is `'small'`; wrap it in a small component instead.

## Variants and states

`ghost` rests in `--v-color-inactive` and darkens to `--v-color-trim` on hover. `danger` rests the same and turns `--v-color-danger` on hover. Both show an accent outline on keyboard focus, and `disabled` dims to half opacity with a `not-allowed` cursor. The button has no padding, so it is exactly the icon's size.

## Accessibility

- It is a real `<button>` named by `label`, so it works with Tab, Enter and Space. Make the label say the action ("Delete item"), not the icon ("Trash").
- Mark the icon component `aria-hidden` (as the example does) so it is not exposed as a separate graphic inside the button.
- For a toggle, pass `aria-pressed` and keep the label the same, or change the label to the action it will do.
- At the default 16px the tap target is small. Use a larger `size` where users touch it, and leave space around it.

## Do and don't

- Do use icons users already know, and keep the same icon for the same action across the app.
- Do give every instance a `label`; it is required for a reason.
- Don't use it for a primary action; use a `Button` with text.
- Don't rely on `danger` colour alone to mark a destructive action; confirm it first.
- Don't set its colour with `className`; the colours come from the theme tokens.
