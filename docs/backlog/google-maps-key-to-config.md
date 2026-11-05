---
priority: p0
components: [Map, MapSelector, UserMap]
---

# Move the Google Maps API key out of the source

## Objective

`components/Map/Map.jsx` contains a Google Maps API key as a string literal, and it is already in the git history and on `origin`. Keys that ship to the browser can't be secret, but an unrestricted one can be copied and run up charges.

## Requirements

- Take the key as configuration (a prop on `Map` / `MapSelector`, or a single setter such as `setGoogleMapsKey`) with no default in the library, so each app passes its own.
- Document it under "Services" in `docs/`: why Google Maps is used and what configuration it needs.
- The user restricts the existing key by HTTP referrer and API, or rotates it, in the Google Cloud console. That step is theirs, not code.
- Map and MapSelector show a clear message in place of the map when no key is set.

## Acceptance criteria

- No key string remains in `components/`.
- The Map and MapSelector examples in the styleguide still render without a key (they show the message).
- Tests cover the "no key" state.
