# Map and MapSelector

`Map` shows a Google Map you drive with props; `MapSelector` puts an address search box above one. Both need an **API key that the app supplies**: the library ships without one.

## What it does for users

- **Map**: `lat`, `lng` and `zoom` set the view and `height` its size. `value` searches for an address and drops a marker on it; `onChange` gets `{ results, address, lat, lng }`, `onNotFound` gets `(address, status)` when nothing matches, and `onLoading` reports when a search starts and finishes. With `autocomplete` and an `addressInput` (a text input), Google suggests addresses as you type.
- **MapSelector**: a search box and a Search button (Enter also searches), the map, and, once a place is found, its address with a button to remove it. "Location not found." appears when a search finds nothing.
- **No key, no map.** If no key is set (and Google isn't already on the page), `Map` shows "Map unavailable: no Google Maps API key is set. Call setGoogleMapsKey() once at startup." in place of the map, and does not load Google's script. `MapSelector` keeps its search box and shows the same message under it.

## Service

| | |
| --- | --- |
| Service | Google Maps JavaScript API, with the Places library (address suggestions) and the Geocoder (address to coordinates) |
| Why | Drawing the map, finding an address, and suggesting addresses while the user types |
| Configuration | One API key, set once at startup with `setGoogleMapsKey(key)` |
| Loaded | From `maps.googleapis.com`, by the first `Map` that mounts; one script for the whole page, however many maps there are |

Set the key where the app starts up, which is also where environment variables should be read:

```js
import { setGoogleMapsKey } from 'volta';

setGoogleMapsKey(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
```

`getGoogleMapsKey()` reads it back (it is `null` until set). Only one key can be used per page: the script is loaded once, by whichever `Map` mounts first, with the key set at that moment. A key set after Google has loaded has no effect on that page.

### The key

A browser key is visible to anyone who opens the page, so it can't be secret, but an unrestricted key can be copied and billed to you. In the Google Cloud console, restrict it to your sites (HTTP referrers) and to the APIs listed above, and set a quota alert.

**The key that used to be hard-coded in `components/Map/Map.jsx` is in this repository's git history and on its remote.** Treat it as public: restrict it to the sites that should use it, or rotate it. That is an account action and is not done by this change.

### In this styleguide

The Map and MapSelector examples talk to a live service, so they show the "no key" message by default (local development doesn't reach live services unless asked). To see live maps, put a key in `.env.local` at the repository root (it is git-ignored):

```text
VITE_GOOGLE_MAPS_API_KEY=your-key
```

Restart the dev server after adding it. This works with `make dev` and with `make up`, since the repository is mounted into the container.

## Web entry points

The `Map` and `MapSelector` pages of the styleguide, and `Map`, `MapSelector`, `setGoogleMapsKey` and `getGoogleMapsKey` from the library.

## Who can change it

It runs in the visitor's browser; there is no permission model. Whoever builds the app chooses the key and where it comes from.

## Tests

- `tests/Map/googleMapsKey.test.js`: no default key; set, trim and clear; exported from the library; and a check that no Google API key appears in the source of `components/`.
- `tests/Map/Map.test.jsx`: the key reaches the script URL (escaped); with no key the message shows, no script loads, nothing throws, and a map that mounts after the key is set works; with Google already loaded no key is needed. The rest drive the component against `tests/Map/fakeGoogleMaps.js`.
- `tests/MapSelector/MapSelector.test.jsx`: the search box stays and the message shows without a key.

## Known limits

- Real Google Maps, the geocoder and autocomplete are tested only against a fake. Nothing here has been run against Google.
- The key is read when a map mounts. Setting it later doesn't revive a map that already showed the message.
- `UserMap` (a Leaflet map) is unrelated and uses no key.

## History

- 2026-11-05: the API key was removed from the source. `setGoogleMapsKey` / `getGoogleMapsKey` added; `Map` and `MapSelector` show a message when there is no key; styleguide reads `VITE_GOOGLE_MAPS_API_KEY`. Branch `backlog/google-maps-key-to-config`; not merged or deployed.
- Not done: restricting or rotating the old key (a Google Cloud console action), and removing it from git history.
