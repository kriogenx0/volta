---
priority: p0
components: [Map, MapSelector]
branch: backlog/google-maps-key-to-config
---

# Restrict or rotate the Google Maps key that was committed

The code half is done on the branch above: the key is no longer in `components/` (apps pass their own with `setGoogleMapsKey`, and without one Map and MapSelector show a message), with tests, including one that fails if a Google API key appears in `components/`. See `docs/features/map.md`.

The old key is still in the git history and on `origin`, and removing it from the source doesn't change that.

## Blocked

Waiting on whoever owns the Google Cloud project, because it is an account action and not a code change.

1. Find the key's last commit without printing it: `git log --oneline -S'AIza' -- components/Map/Map.jsx` shows the commits that added and removed it. The key is in `components/Map/Map.jsx` at the parent of the commit that removes it.
2. In the Google Cloud console, for the project that owns that key, either:
   - **restrict it**: Application restrictions, HTTP referrers, only the sites that should use it; API restrictions, only Maps JavaScript API, Places API and Geocoding API; and set a quota or billing alert; or
   - **rotate it**: create a new key with those restrictions, give it to the apps that use Maps (they pass it to `setGoogleMapsKey`), then delete the old one.
3. Decide whether to rewrite git history to drop the old key. That is a destructive change to a shared remote and needs your go-ahead; rotating the key makes it unnecessary.

To finish: when the old key is restricted or deleted, delete this file.
