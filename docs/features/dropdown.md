# Dropdown

A button that reveals a floating panel of any contents. `DropdownList` (a list of options), `ActionMenu` (a menu behind an ellipsis button) and `DatePicker` (a calendar) are built on it.

## What it does for users

- **Where the panel goes.** Below the trigger, 4px away, left-aligned (`constrainWidth` makes it as wide as the dropdown). When it doesn't fit below the trigger and there is more room above, it opens above instead (`dropdown-contents--above`). That is worked out each time it opens, from where the trigger is and how tall the panel is.
- **How it closes.**
  - Escape, from anywhere on the page.
  - A click outside it. With the dimming overlay (the default) the click lands on the overlay and goes no further; with `showOverlay={false}` a document listener closes it on a mouse-down outside.
  - A click on anything inside marked `data-dropdown-close` (a choice), or on something inside such an element.
  - **Not** any other click inside. A panel can hold controls that are used more than once (paging a calendar, a counter) without closing.
- **Focus** returns to the trigger after it closes, unless the user has already moved it somewhere outside.
- **Open state** is managed by the dropdown unless the parent passes `open`; then `onClick` and `onClose` report what to do.

## Behaviour change

A click anywhere inside the panel used to close it. It no longer does. Contents that relied on that either mark the element that is the choice, or opt back in for the whole panel:

```jsx
<Dropdown label="Account">
  <div data-dropdown-close><MenuItem /></div>   {/* closes when clicked */}
  <Counter />                                   {/* clicks here leave it open */}
</Dropdown>

<Dropdown label="Account" closeOnContentClick>  {/* the old behaviour */}
```

`DropdownList` and `ActionMenu` already close themselves when an option is chosen, and now report that through `onToggle(false)` themselves (they used to get that notification from the old click-anywhere rule). Clicking a disabled item, such as "No options available.", no longer closes the list. `DatePicker` no longer stops click propagation around its calendar.

## Props

| Prop | |
| --- | --- |
| `label` | the label of the built-in button |
| `className` | added to the dropdown's root element |
| other props | go to the built-in button (for example `disabled`) |
| `buttonComponent` | your own trigger element |
| `open`, `onClick`, `onClose` | control it from outside |
| `closeOnContentClick` | close on any click inside (default `false`) |
| `showOverlay` | the dimming overlay behind it (default `true`) |
| `constrainWidth` | make the panel as wide as the dropdown |

## Code

`components/Dropdown/Dropdown.jsx`; the above/below decision is a pure function in `components/Dropdown/placement.js` (`placePanel`, and the 4px `GAP` the stylesheet repeats).

## Tests

- `tests/Dropdown/Dropdown.test.jsx`: opening and closing (managed and controlled), Escape and focus, a click inside staying open, `data-dropdown-close`, `closeOnContentClick`, outside clicks with and without the overlay (and cleanup), and placement with the layout mocked.
- `tests/Dropdown/placement.test.js`: the above/below rule, including when it fits neither side and the gap.
- `tests/DropdownList/`, `tests/ActionMenu/` and `tests/DatePicker/` cover the components built on it, including the calendar staying open while paging months. Putting the old default back fails 5 tests.

## Known limits

- **The panel is placed once, when it opens.** It does not move if the window is resized or scrolled while it is open, or if its contents change height.
- **Only the vertical direction flips.** A trigger near the right edge can still push the panel off the right side.
- **The overlay still dims the whole window** (40% black) whenever it is on; `showOverlay={false}` removes it.
- Placement was tested with the layout mocked; nothing here was checked in a real browser.

## History

- 2026-11-05 (branch `backlog/dropdown-panel-position-and-close`, not merged or deployed): panel below the trigger and flipping above; a click inside no longer closes it; `data-dropdown-close` and `closeOnContentClick`; outside-click closing without the overlay; `DatePicker`'s position and click workarounds removed; `DropdownList` and `ActionMenu` report their own close.
- Not verified: the look and position of the panel in a real browser at desktop and mobile widths, and the flip near the bottom of a short window.
