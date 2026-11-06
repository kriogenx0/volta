# MapSelector

An address search box above a Google map: the user searches, and you get the place that was found.

## When to use

- **Letting the user pick a location by address**, such as a store, an event venue or a delivery address. `onChange` gets the found place.
- Use [`Map`](../Map/README.md) directly when you only display a place or bring your own search UI. Use [`TextField`](../TextField/README.md) when you only need the address as text.
- It needs a network connection, because the map and the address suggestions come from Google. Offline, the search box still works but the map area stays blank.

## Usage

```jsx
import { MapSelector } from 'volta';

<MapSelector
  placeholder="Search for a store or street address..."
  defaultValue="1600 Amphitheatre Parkway, Mountain View, CA"
  onChange={(place, searchedText) => setPlace(place)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | `null` | An address to start on. It fills the box and is searched, and is searched again whenever the prop changes. |
| `defaultValue` | `string` | `null` | An address to start on that later changes do not override. It wins over `value` at the start. |
| `placeholder` | `string` | `'Enter a street address...'` | Placeholder of the search box, also used as its `aria-label`. |
| `onChange` | `function` | no-op | Called with the found place (`{ address, lat, lng, results }`) and the text that was in the box. |

Searching happens on the Search button or the Enter key, not as the user types, except when picking one of Google's address suggestions. A found place shows under the box with an `X` button to remove it (this does not call `onChange`). "Loading..." and "Location not found." appear below the box as text.

## Accessibility

- The search box is a native text input named by `placeholder` (via `aria-label`); Search and the remove button are real buttons, and the remove button has `aria-label="Remove location"`.
- Enter in the box runs the search, so the whole flow works from the keyboard. The map itself is Google's and has its own controls.
- "Loading..." and "Location not found." are plain text, not a live region, so a screen reader is not told when they appear.
- The found address is text, so the chosen place is available without the map.

## Do and don't

- Do set a `placeholder` that says what to enter ("Search for a store or street address..."); it is the box's accessible name.
- Do keep the `onChange` result in your own state; the component gives no other way to read the chosen place.
- Don't treat removing the place with `X` as a change you will be told about; clear your own state if the field is required.
- Don't use it where the network may be missing; use a text field.
- Don't mount it for an address you only display; use [`Map`](../Map/README.md).
