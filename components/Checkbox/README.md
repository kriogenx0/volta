# Checkbox

A native checkbox with a text label, restyled to look the same in every browser.

## When to use

- **A yes/no choice submitted with a form**, or one of several independent choices ("Send me updates", "I agree").
- An on/off setting that applies as soon as it is flipped is a `Toggle`.
- Several related checkboxes from a list of options are a [`CheckboxGroup`](../CheckboxGroup/README.md). One choice from several is a `RadioGroup` or `SegmentedControl`.

## Usage

```jsx
import { Checkbox } from 'volta';

<>
  <Checkbox label="Send me updates" name="updates" checked={updates} onChange={(e) => setUpdates(e.target.checked)} />
  <Checkbox label="Accept the terms" name="terms" defaultChecked />
  <Checkbox label="Not available" disabled />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | | The text beside the box. It is also the `title` (tooltip) of the whole control. |
| `disabled` | `bool` | | Native `disabled`: not focusable, no changes. The control is dimmed and shows a not-allowed cursor. |

Every other prop goes to the `<input type="checkbox">`: `checked` with `onChange` (controlled) or `defaultChecked` (uncontrolled), `name`, `value`, `id`, `required`, `aria-*`. There is no `className` prop.

## Accessibility

- The `<input>` is inside a `<label>`, so the label text is its accessible name and clicking the text toggles it.
- With no `label` the checkbox has no name; pass `aria-label`.
- It is a native checkbox: Tab to reach it, Space to toggle.
- A visible focus ring (`:focus-visible`) and a tick mark show focus and state; the state is not colour alone.
- Disabled is shown by dimming and a not-allowed cursor, as well as the native disabled state.

## Do and don't

- Do word the label so that ticking means yes ("Send me updates"), never a double negative.
- Do wrap it in a `Field` when it needs a heading, hint or error.
- Don't use a checkbox for an action that happens immediately; use a `Toggle` or a `Button`.
- Don't make the label vanish into the page; keep it visible beside the box.
- Don't build your own box with a styled `<div>`; use this one so keyboard and screen readers work.
