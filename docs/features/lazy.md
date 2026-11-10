# Lazy

`Lazy` holds back its children until it is near the screen, then renders them and keeps them. It is for long pages made of heavy parts, where rendering everything at once makes the page slow to open. Guideline: `components/Lazy/README.md`; examples under Layout in the styleguide.

## What it does

- Renders its `placeholder` (nothing by default) in a wrapper `div.volta-lazy` until an `IntersectionObserver` reports it within `rootMargin` (400px by default) of the viewport, then renders its children and stops watching.
- `minHeight` keeps the wrapper's place until then so the page doesn't jump. The wrapper has `aria-busy="true"` while waiting.
- `load` shows the children now (for "jump to this section"); `onLoad` is called once when they show.
- Without `IntersectionObserver` the children render at once.

## Where it lives

`components/Lazy/` (`Lazy.jsx`, `Lazy.scss`, `README.md`), exported as `Lazy`; examples in `examples/Lazy/`.

## Tests

`tests/Lazy/Lazy.test.jsx` drives a fake `IntersectionObserver`: held back until visible, placeholder, `minHeight` and `aria-busy`, disconnect after showing, `rootMargin`, `load` and `onLoad` once, no `IntersectionObserver`, `as` and passed-through props.

## Known limits

- It never unloads: once shown, the children stay mounted.
- It is not used anywhere in the library yet. The styleguide's Components page shows one component at a time, so it doesn't need it; an earlier attempt at one long page of every component was dropped as too heavy.
- Not checked in a real browser: `IntersectionObserver` is faked in the tests, so the scroll behaviour itself is unverified.

## History

- 2026-11-10 (local, not merged or deployed): added.
