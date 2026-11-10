# ActionMenu

A "more actions" button that opens a short menu of commands for one row, card or record.

## When to use

- **Several secondary commands that don't each deserve a button** ("Rename", "Duplicate", "Delete"), usually at the end of a row or in a card corner.
- One command is a [`Button`](../Button/README.md) (`link` variant for low emphasis); pick a visible button over a menu when there is room.
- A labelled dropdown with your own content in it is a [`Dropdown`](../Dropdown/README.md). Choosing a value for a form is a [`NativeSelect`](../NativeSelect/README.md).
- Don't hide the main action of a view in a menu.

## Usage

```jsx
import { ActionMenu } from 'volta';

<ActionMenu
  items={['Rename', { label: 'Delete', action: removeItem }]}
  onSelect={(item, index) => track(item, index)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | `array` of `string` \| `{ label, action }` | none | A string is the label. In the object form `label` is a required string and `action` an optional function run when the item is chosen. |
| `onSelect` | `function` | no-op | Called with `(item, index)`, the item exactly as it was passed in, before its `action` runs. |
| `onToggle` | `function` | | Called with `true` when the menu opens and `false` when it closes. |

## Behaviour

- The trigger is a `link` `Button` with an ellipsis icon. Its label ("Actions") is fixed and is not a prop.
- Choosing an item calls `onSelect`, closes the menu and then runs `item.action`.
- The menu also closes on Escape and on a click outside it. Focus goes back to the trigger after it closes.
- The list scrolls past 400px. Items are text only, and there is no disabled item.

## Accessibility

- The trigger has `aria-label="Actions"`, `aria-haspopup="menu"` and `aria-expanded`. The list is `role="menu"` with `role="menuitem"` items.
- Items are focusable and work with Enter and Space. Tab moves from the trigger into the items; there is no arrow-key navigation between them.
- Focus does not move into the menu when it opens.
- The trigger's name is always "Actions" and can't be set per row, so in a list every trigger sounds the same to a screen reader.

## Do and don't

- Do keep items short verbs ("Archive", not "Archive this record now").
- Do put the destructive item last and confirm it in a `Dialog` before acting.
- Don't nest a menu inside a menu, or use it for navigation; use [`ActionLink`](../Link/README.md).
- Don't rely on `onToggle` to mirror state; the menu owns its own open state.
