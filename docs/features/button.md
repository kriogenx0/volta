# Button

A button with a look (`variant`), an optional `size`, and the usual `disabled`, `onClick`, `type` and label.

```jsx
<Button variant="primary" onClick={save}>Save</Button>
<Button variant="danger" size="small">Delete</Button>
<Button type="submit" full>Send</Button>
```

| Prop | Values |
| --- | --- |
| `variant` | `default`, `primary`, `link`, `danger` |
| `size` | `small`, `large`, `tiny` |
| `type` | the HTML button type: `button` (the default), `submit`, `reset` |
| `full` | fills the width of its container |
| `disabled`, `onClick`, `className`, `label` or children | as you'd expect; other props go to the `<button>` |

## Deprecated ways of choosing the look

Three older ways still work, so apps that use them keep their look, but each **warns once in the console** and says what to use:

| Old | Use |
| --- | --- |
| `<Button tiny>` | `<Button size="tiny">` |
| `<Button bsStyle="primary">` | `<Button variant="primary">` |
| `<Button type="primary">` | `<Button variant="primary">` (`type` is the HTML type; with a variant name it still renders `type="button"`) |

How they combine is unchanged: `variant` beats `bsStyle` and `type`, and `tiny` beats `size`. Nothing in this repository uses them any more (`ClipboardHover`'s `tiny` was the last), and `tests/noLegacyButtonProps.test.js` keeps it that way by reading the JSX.

The warning is not limited to development builds: the library build leaves `process.env.NODE_ENV` in place, and `process` doesn't exist in a browser, so there is nothing to gate it on.

## Not done

The task asked to remove the legacy handling after migrating. It is still here, because it is a breaking change and apps outside this repository may use it: the `ironyoung-compat` comments in `Button.jsx` name one (its Rails asset pipeline owns the real button look through a plain `.btn` class, and its callers pass `variant` and `size` as literal class names). Removing it is waiting on confirmation that no consumer passes `bsStyle`, `tiny` or `type="primary"`; the warnings will say so in their consoles first (`docs/backlog/migrate-button-legacy-props.md`).

## Tests

`tests/Button/ButtonLegacy.test.jsx`: every variant and size gets its class with no warning; the HTML types stay plain; each legacy way still works exactly as before, warns once per way and value with the right message, and loses to `variant` or wins over `size` as it did. `tests/noLegacyButtonProps.test.js`: no `<Button>` in `components/`, `examples/` or `styleguide/` uses a legacy prop (found with the parsed JSX, so multi-line elements count); it fails on a planted one.

## History

- 2026-11-06 (branch `backlog/migrate-button-legacy-props`, not merged or deployed): `ClipboardHover` migrated, the legacy props warn once, the tests.
- Before this the legacy handling had no tests at all.
