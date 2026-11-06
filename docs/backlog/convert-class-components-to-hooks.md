---
priority: p3
depends_on:
  - google-maps-key-to-config
branch: backlog/convert-class-components-to-hooks
---

# Convert the remaining class components to hooks

`Map` is the last class component (error boundaries stay classes: `styleguide/views/ComponentExamples/ExampleErrorBoundary.jsx`). `MapSelector` and `ImageCrop` are converted (see [docs/features/function_components.md](../features/function_components.md)).

## Left to do

Convert `Map` (Google Maps script loading, geocoding, marker; keep the behaviour covered by `tests/Map/fakeGoogleMaps.js` and `tests/Map/Map.test.jsx`). It waits for `google-maps-key-to-config`, which edits the same file; do it after that merges.

Then delete `components/Map/Map.jsx: Map` from `NOT_CONVERTED_YET` in `tests/noClassComponents.test.js` (the test fails until it is gone) and update the Known limits of the feature doc.

## Acceptance criteria

- No `extends React.Component` outside error boundaries (`tests/noClassComponents.test.js` with an empty list).
- Existing tests for `Map` pass unchanged; add tests first where its behaviour isn't covered.

## Unverified

`MapSelector` and `ImageCrop` were converted and checked by their unit tests only. In a real browser, check that `ImageCrop` drags with the mouse, scales with the slider, centres and crops to a file, and that `MapSelector` searches by button and Enter, shows the found address and removes it.
