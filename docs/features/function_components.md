# Function components

Every component in the library is a function component with hooks, except `Map` (the one class left) and the styleguide's error boundary (React still requires an error boundary to be a class). `docs/project/design-system.md` (rule 15) asks for hooks in new components and for converting a class when it is touched and the conversion is low-risk; function components take their defaults as parameters because React 19 ignores `defaultProps` on them under the automatic JSX runtime.

## What changed for users

Nothing visible: the props, the markup and the behaviour are the same. Two small differences in `ImageCrop`, both fixes of things the class ignored:

- A new `image` prop replaces the picture (a new object URL; the old one is released). The class read `image` only when it mounted.
- The name of the cropped file comes from the current `image`, not the one it started with.

`MapSelector` and `ImageCrop` are the two converted here; `ColorPickerSlider`, `ColorPickerSquare` and the other components were converted earlier.

## How the conversions work

- **Things that outlive a render** (the picture's `load` listener, the page-wide mouse listeners while dragging, the fade and close timers, the map's callbacks) call the latest function and props through a ref that is reassigned on every render, as a class method read `this.props` and `this.state` when it ran. `ImageCrop` calls `latest.current.centerImage` from the load listener, so a size changed before the picture loads is the size it centres on; `MapSelector` reports the text that is in the search box now.
- **Listeners and URLs are cleaned up by the effect that made them**: the mouse listeners exist only while `moving`, and the object URL is revoked when the picture changes or the cropper leaves.
- **`MapSelector` searches again when `value` changes**, but not on the first render (which already started on it), by comparing to the previous value in a ref.
- Dead code dropped in `MapSelector`: `clearAddress` (never called) and the `loading` state (never read).

## Tests

- `tests/MapSelector/MapSelector.test.jsx` and `tests/ImageCrop/ImageCrop.test.jsx` pass unchanged.
- `tests/ImageCrop/ImageCropLifecycle.test.jsx` covers what the conversion could have broken across renders: the new size used on load, the `onClose` it has now, a new picture replacing the old URL, the file name from the current picture, one picture and one URL across renders.
- `tests/noClassComponents.test.js` fails on a new class component (error boundaries excepted) and on a name left in its list after the class was converted, so the list only shrinks. It lists `Map`.
- Mutation-checked: capturing `onClose`, the load listener or the file name from the first render, not revoking the URL, not removing the drag listeners, reporting stale search text, ignoring a `value` change, and searching on the first render each fail a test; a new class and a stale list entry each fail the ratchet.

## Known limits

- **`Map` is still a class.** It is the Google Maps lifecycle (script loading, geocoding, marker) and `docs/backlog/google-maps-key-to-config.md` edits the same file, so converting it now would conflict with that task. `docs/backlog/convert-class-components-to-hooks.md` keeps it, with `depends_on` that task.
- **Not checked in a browser.** `ImageCrop` and `MapSelector` are interaction-heavy and jsdom can't judge dragging or the map; they were checked by their unit tests only.

## History

- Implemented 2026-11-06 on branch `backlog/convert-class-components-to-hooks`: `MapSelector`, `ImageCrop`. Not merged or deployed. Not implemented: `Map`.
