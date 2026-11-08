# IndicatorDot

A small coloured dot that marks a status next to a label: complete, incomplete, exported, deleted.

## When to use

- **A compact status marker beside text** in a list or table row, where the text says the status and the dot repeats it.
- A status that needs words in a pill is a [`Badge`](../Badge/README.md) with a `tone`. A removable or clickable label is a [`Tag`](../Tag/README.md). Something in progress is a [`Loader`](../Loader/README.md).

## Usage

```jsx
import { IndicatorDot } from 'volta';

<>
  <IndicatorDot variant="complete" /> Complete
  <IndicatorDot variant="incomplete" size="small" /> In progress
  <IndicatorDot role="img" aria-label="Exported" variant="exported" />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `string` | | The colour: `complete`, `incomplete`, `exported` or `deleted`. Without one the dot is a neutral grey. Nothing checks the value, and an unknown one is also grey. |
| `size` | `string` | | `'small'` makes the dot smaller. Without it the dot is 11pt. Nothing checks the value. |
| `className` | `string` | | Added to the wrapper. |

Any other prop goes to the wrapping `<div>`. It is an `inline-block` that sits in line with text. The dot is the `circle.fill` glyph from `Icon`, so it needs the same icon fonts (see [`Icon`](../Icon/README.md)).

## Variants and states

| Variant | Colour |
| --- | --- |
| (none) | `--v-color-trim-less-subtle`, a neutral grey |
| `complete`, `exported` | `--v-color-success` |
| `incomplete` | `--v-accent` |
| `deleted` | `--v-color-base-subtle`, a very faint grey |

## Accessibility

- A dot is colour alone, and colour alone must never carry state. Always put the status in text next to it, or give the dot `role="img"` and an `aria-label` (the props go to the wrapper `div`) so a screen reader gets the same information.
- The glyph itself has no label and is not hidden from assistive technology; a labelled `role="img"` wrapper makes its content presentational.
- The dot is not interactive and has no hover state.

## Do and don't

- Do pair every dot with a text label or `aria-label` that names the status.
- Do use the same variant for the same meaning across the app.
- Don't use colour as the only difference between two statuses a user must tell apart; add text.
- Don't make it clickable; use a `Button`, `Tag` or `Badge` for something interactive.
- Don't use `deleted` for something the user still needs to see; its colour is very faint.
