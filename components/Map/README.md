# Map

A Google map that shows a marker, finds an address you give it and reports the place it found.

## When to use

- **Showing or finding one place.** Give it an address in `value` or a position in `lat` and `lng`, and read the result in `onChange`.
- Use [`MapSelector`](../MapSelector/README.md) when the user should type an address and pick a place: it wraps `Map` with a search box, a Search button and the found address.
- It needs a network connection: it loads Google's script the first time a map mounts, and offline the area stays blank.
- `UserMap.jsx` in this folder is an unrelated Leaflet region editor that is not exported from the library.

## Usage

```jsx
import { Map } from 'volta';

<Map
  value="1600 Amphitheatre Parkway, Mountain View, CA"
  height={240}
  onChange={(place) => setPlace(place)}
  onNotFound={(address, status) => setMessage('Location not found.')}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | | An address to search for. The map centers on it and puts the marker there. It searches again when `value` changes, and clears the marker when it becomes empty. |
| `lat` | `number` | `39.8097343` | Starting center (the middle of the US). At the start it only centers the map; the marker appears when a search finds a place or when `lat` or `lng` changes later, which moves the marker there and re-centers. |
| `lng` | `number` | `-98.5556199` | See `lat`. |
| `zoom` | `number` | `4` | Starting zoom. It is read once, when the map starts. |
| `height` | `number` \| `string` | `300` | Height of the map area, as a number of pixels or any CSS height. |
| `onChange` | `function` | no-op | Called with `{ results, address, lat, lng }` when a search finds a place. |
| `onLoading` | `function` | | Called with `true` when a search starts and `false` when it ends. |
| `onNotFound` | `function` | no-op | Called with `(address, status)` when a search finds nothing. |
| `autocomplete` | `bool` | `true` | Attach Google's address suggestions to `addressInput`. Does nothing without `addressInput`. |
| `addressInput` | `element` \| `object` | | The text `<input>` element to attach suggestions to. Choosing a suggestion searches for the text in it. |
| `markers` | `array` | | Declared but not used by the component. |

`Map` only searches when `value` changes; it has no search box of its own.

## Accessibility

- Google draws the map and supplies its own pan, zoom and keyboard controls. `Map` adds no role or label, so the map is not described to a screen reader.
- Always show the address or place as text next to the map (as `MapSelector` does), and never make the map the only place a location appears.
- When you give it your own search input, label that input and announce the "not found" result as text.

## Do and don't

- Do handle `onNotFound`; without it a failed search is silent.
- Do give it a `height` that fits mobile (a 375px screen has little room).
- Don't use it offline-first; the map area stays blank without Google's script.
- Don't pass `markers`; it has no effect.
