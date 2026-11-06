# Badge

A small label that marks a state: a coloured text pill (`Paid`, `Draft`) or a status icon (a check or a cross).

## When to use

- **A short status next to something else**: a record's state, a count label, "New". Use a `tone` and put the word in `children`.
- **A verified or rejected mark** next to a name: the icon form, `variant="check"`, `"bluecheck"` or `"x"`.
- A dot that only shows presence or health is an [`IndicatorDot`](../IndicatorDot/README.md). A label the user can add, remove or click is a [`Tag`](../Tag/README.md).
- Not for anything the user can press; a badge has no hover or click state.

## Usage

```jsx
import { Badge } from 'volta';

<>
  <Badge tone="success">Paid</Badge>
  <Badge tone="danger">Overdue</Badge>
  <Badge>Draft</Badge>
  <Badge variant="check" size="small" aria-label="Verified" role="img" />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `tone` | `'success'` \| `'warning'` \| `'danger'` \| `'neutral'` \| `'info'` | `'neutral'` | The pill's colour. Giving `tone` or `children` makes the text pill. `Badge.tones` lists them. |
| `variant` | `'check'` \| `'bluecheck'` \| `'x'` | | Icon form. Used only when there are no `children` and no `tone`. With none of the three props the badge renders nothing. |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Icon form only (18px, 24px, 36px). `Badge.sizes` lists them. The pill has one size. |
| `children` | `node` | | The pill's text. |

Other props go to the element: `aria-label`, `role`, `title`, `data-*`. `style` is applied to the icon form only.

## Theming

The pill is a 15% tint of its tone (`--v-color-success`, `--v-color-warning`, `--v-color-danger`, `--v-accent` for `info`) with text mixed toward `--v-color-trim`, so contrast holds in light and dark. `neutral` uses `--v-color-base-more-subtle`. The icon form is different (see Legacy).

## Legacy

The icon variants (`check`, `bluecheck`, `x`) use fixed colours written into `Badge.variants`, not theme tokens, so they don't follow the theme or the accent. Prefer the `tone` pill in new code.

## Accessibility

- The pill is a plain `<span>`; its text is read as it is. Make the text carry the state ("Overdue"), because colour alone is not enough.
- The icon form is an `<i>` with no name of its own, so pass `role="img"` and `aria-label` ("Verified"), or it is silent to a screen reader.
- A pill is not focusable and has no interaction.

## Do and don't

- Do keep the text to one or two words.
- Do pair `danger` and `warning` with words that say what is wrong.
- Don't put a badge's colour in `className` or `style`; choose a `tone`.
- Don't use the icon form without an `aria-label`.
- Don't stack several badges on one item; pick the most important state.
