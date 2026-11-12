# Interactive states: keyboard operation and focus

Every interactive component needs to work from the keyboard and show where focus is, and also to have hover and disabled states. `tests/interactiveStates.test.jsx` audits the part that can be checked without a browser, over every styleguide example.

## What is audited

1. **Anything that reacts to a click works without a mouse.** The test renders every example and finds each element with a click handler (React keeps an element's props on its DOM node). It must be a native control (button, link with an `href`, input, select, textarea, label, summary), or have a role and a tab stop. For the roles whose items take turns being the tab stop (tab, option, menu item, radio, tree item, grid cell), `tabindex="-1"` on the others is accepted: they are reached with the arrow keys.
2. **No positive `tabindex`**, which pulls an element out of the natural order.
3. **A stylesheet that removes the focus outline puts something visible back**: a border, a shadow, or a focus ring on a container. (`TextBox`, `NativeSelect`, `ComboBox` swap in an accent border, `Slider` a ring, `AutoComplete` the container's `:focus-within`.)

It is a ratchet. A new click-only element fails the test: make it a control, or add it to the reviewed list with a reason. An exception that is no longer found fails it too, so the list can't go stale. The audit checks itself (a clickable `div`, `span` and `li` are flagged; a button, a link and a role with a tab stop are not), and it flagged the old `Tabs` when that was put back.

## What it found and fixed

- **`Tabs`** had a click handler on each `<li>` and nothing else: no role, no tab stop, so the tabs could not be reached or used from the keyboard. They are now a tab list: `role="tablist"` with `role="tab"` items and `aria-selected`; one tab in the tab order (the selected one, or the first); the arrow keys move focus, Home and End jump to the ends; Enter and Space choose the focused tab. Browsing with the arrows doesn't call `onSelect`. A focus ring was added.
- **`FileUploader`**: the box (click to choose a file), the Upload action and the Cancel action were click-only `<div>`s, and Cancel (an icon) had no name. They are buttons for the keyboard now (`asButton`, below), and Cancel is named "Cancel upload". An empty box is named "Choose a file".
- **`VideoUploadPlayer`**: the same for its upload box.

`util/keyboard.js` has `asButton(onActivate)`: the props that make a non-button element work as a button (role, tab stop, click, Enter and Space). Prefer a real `<button>`; use it where an element has to hold other content, as these boxes do.

## What is left, by design

Each is listed with its reason in `EXCEPTIONS` in the test. They are containers that hear clicks from keyboard-operable controls inside them (the panels of Dropdown, DropdownList, ActionMenu, DatePicker, the AutoComplete list); backdrops and scrims that close on a click outside, where Escape does the same (Dialog, PopOver, ModalDialog, Drawer; `SearchSelector`'s popover was one too, until it left the styleguide); react-select's remove control (not ours); a disabled item (not meant to take focus); `VideoPlayer`'s `<video>` (native controls, or the keyboard handling it adds); the wrapper `ImageUploader` puts around the control you pass it; and one example's own parent.

## Not audited (needs a browser)

jsdom has no CSS, so these were not checked:

- that hover, focus and disabled states look right and are visible in light and dark, and under a non-default theme;
- how strong the focus indication is. `TextBox`, `NativeSelect` and `ComboBox` show focus only by changing the 1px border to the accent colour, which is easy to miss; a ring would be clearer.

## Observations

- **Unselected tabs are 1.61:1** in light mode, which is not readable (`docs/backlog/tabs-unselected-text-contrast.md`).
- `ImageUploader` is keyboard operable only if the child you give it is (a button works; an avatar doesn't).

## History

- 2026-11-05 to 06 (branch `backlog/audit-interactive-states`, not merged or deployed): the audit, the `Tabs`, `FileUploader` and `VideoUploadPlayer` fixes, and `asButton`.
- Not verified in a browser: how the new tab focus ring and the box buttons look, or anything in the "Not audited" list.

## Disabled and read-only controls

A control the user can't use shows no hover or press change (colour, border or size). Found and fixed on 2026-11-12: the default `Button` (hover colours applied while disabled), the shared field look (`field-surface`, so TextBox, NativeSelect, ComboBox and the bare inputs changed border on hover while disabled), `MultiSelect`, a disabled `TextEditable`, a read-only `RichText` (its border changed on hover though it can't be clicked into), and the current-day highlight of a disabled date. Disabled fields are now dimmed with a not-allowed cursor.

`tests/disabledStates.test.js` compiles the stylesheets of the components that can be disabled and fails when a `:hover` or `:active` rule doesn't exclude the disabled state in its selector (the few that can't reach one are listed with the reason). Not covered: components not in that list, and anything that needs a browser to see. `.component-action_list` in `styles/components/lists.scss` still has a hard-coded hover colour; nothing uses it.
