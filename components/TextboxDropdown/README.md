# TextboxDropdown

A textbox with a panel under it, as wide as the textbox, that opens when the box is focused.

## When to use

- **A field that offers choices as you type or click:** a suggestion list, a few quick values, a small picker. It is the shared part of that kind of field: the open and close rules, the position and the width.
- A panel that hangs from a button instead is [`Dropdown`](../Dropdown/README.md), which this is built on. A fixed choice of one is [`NativeSelect`](../NativeSelect/README.md); a field with the whole behaviour built in is [`ComboBox`](../ComboBox/README.md), [`DatePicker`](../DatePicker/README.md) or [`TimePicker`](../TimePicker/README.md).
- It adds no dimmed backdrop, so it is not a dialog; for a blocking decision use [`Dialog`](../Dialog/README.md).

## Usage

```jsx
import { TextboxDropdown, TextBox, List } from 'volta';

<TextboxDropdown
  open={open}
  onOpenChange={setOpen}
  panelRole="listbox"
  panelLabel="Fruit"
  textbox={<TextBox label="Fruit" value={value} onChange={(e) => { setValue(e.target.value); setOpen(true); }} />}
>
  <List items={matches.map((name) => ({ label: name, action: () => choose(name) }))} />
</TextboxDropdown>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `textbox` | `element` | | The field the panel hangs from: one element, such as a `TextBox`. It gets `onFocus` and `onClick` (yours still run) and `aria-expanded`, `aria-haspopup` and `aria-controls`, so it has to pass props on to its input. |
| `children` | `node` | | The panel's contents. The panel has 8px of padding. |
| `open` | `bool` | | Controls it. Leave it out and the panel opens and closes itself. |
| `onOpenChange` | `function` | | Called with `true` or `false` when it asks to open or close, whether or not you control it. |
| `closeOnContentClick` | `bool` | `false` | Close on any click inside the panel. Otherwise only an element marked `data-dropdown-close` closes it. |
| `panelRole` | `string` | `'dialog'` | The panel's role, and the value of the textbox's `aria-haspopup`: `'listbox'` for a list of options. |
| `panelLabel` | `string` | | The panel's accessible name. |
| `className` | `string` | | Added to the root, after `volta-textbox_dropdown`. |

## Behaviour

- It opens when the textbox gets focus or is clicked.
- It closes on Escape, on a click outside, on a choice marked `data-dropdown-close`, and **the moment focus leaves** for anything outside the textbox and the panel. Moving focus from the box into the panel (a button in it) keeps it open.
- Pressing the panel's text or empty space does not take focus from the textbox, so the panel does not close under the pointer. A press on a control inside (a button, a field, a link) does take focus, as usual.
- The panel is as wide as the textbox (`Dropdown`'s `constrainWidth`), opens below it, or above it when there is no room below.

## Accessibility

- The textbox carries `aria-expanded`, `aria-haspopup` and `aria-controls` pointing at the panel, so a screen reader knows it has a popup and whether it is showing.
- Give the panel a name with `panelLabel` and the right `panelRole`. For a `listbox`, the options inside need `role="option"` and arrow-key handling, which this component does not provide.
- Escape closes it from anywhere on the page. Controls in the panel must be native or have a role and a tab stop, so they work from the keyboard.

## Do and don't

- Do put the panel's choices where Tab can reach them, or handle the arrow keys yourself.
- Do set `open` from your own state when the panel should open as the user types (as in the example), not only on focus.
- Don't use it for a modal question; it never dims the page.
- Don't put a second dropdown inside it.
