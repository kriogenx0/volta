---
priority: p3
---

# Convert the remaining class components to hooks

Every function component now takes its defaults as parameters (React 19 ignores `defaultProps` on them under the automatic JSX runtime), and `tests/noFunctionDefaultProps.test.js` keeps it that way. What is left is the three class components, which React 19 still supports but the design system asks to convert when they are touched and the conversion is low-risk:

- `Map` and `MapSelector` (Google Maps lifecycle and geocoding; keep the behaviour covered by `tests/Map/fakeGoogleMaps.js`)
- `ImageCrop` (mouse drag, canvas, object URL cleanup)

`ColorPickerSlider` and `ColorPickerSquare` have already been converted.

Error boundaries stay classes (`styleguide/views/ComponentExamples/ExampleErrorBoundary.jsx`).

## Acceptance criteria

- No `extends React.Component` outside error boundaries.
- Existing tests for each component pass unchanged; add tests first where a component's behaviour isn't covered.
- Checked in a real browser, since Map and ImageCrop are interaction-heavy and jsdom can't judge them.
