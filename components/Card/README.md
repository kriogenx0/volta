# Card

A bordered surface that groups related content, optionally selectable.

## When to use

- **A self-contained block of content** that sits on its own: a summary, a choice, a record. Make it `selectable` for a "pick one of these" grid.
- A list of rows is a `List` or `ListCard`; page structure and columns are layout, not cards.
- A status label is a [`Badge`](../Badge/README.md). A dialog or panel that floats over the page is a `Dialog` or `Drawer`.

## Usage

```jsx
import { Card } from 'volta';

<>
  <Card>Plan summary</Card>
  <Card
    selectable
    selected={plan === 'pro'}
    onClick={choosePro}
    onKeyDown={chooseProOnEnterOrSpace}
    role="button"
    tabIndex={0}
    aria-pressed={plan === 'pro'}
  >
    Pro
  </Card>
  <Card padding="none"><img src="/photo.jpg" alt="Harbour at dawn" /></Card>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `padding` | `'none'` \| `'sm'` \| `'md'` | `'md'` | Inside space: 0, 12px or 16px. Also gives the card its rounded 8px, themed border. |
| `selectable` | `bool` | `false` | Pointer cursor and no text selection. It does not add keyboard or screen-reader behaviour. |
| `selected` | `bool` | `false` | A 2px accent border. The padding shrinks by 1px so the card keeps its size. |
| `onClick` | `function` | | Called when the card is clicked. |
| `className` | `string` | `''` | Added to the classes. |
| `children` | `node` | | The content. |

Any other prop goes to the `<div>`. A falsy `padding` (such as `null`) drops back to the legacy look: square corners, a pale border and 15px padding. New code leaves `padding` alone or sets one of the three.

## Default look

The card is `inline-block`, with `text-align: center` and `font-size: 150%` by default, so put your own layout inside it and reset the text size there if you need to.

## Accessibility

- A card is a `<div>`. `selectable` and `onClick` only change how it looks and reacts to a mouse. For a card that can be chosen, pass `role="button"`, `tabIndex={0}`, `aria-pressed` for the selected state, and handle Enter and Space with `onKeyDown`. Or put a real `Button` or link inside.
- Selection shows as a thicker border as well as a colour change, so it is not colour alone.
- The default text colour is the pale `--v-color-base-less-subtle`, far under 4.5:1 against the page. Check the contrast of what you put in, and keep text in elements that use the theme text colours.

## Do and don't

- Do give a clickable card a focus state and a keyboard path, as above.
- Do use `padding="none"` for a card that holds an edge-to-edge image or its own padded layout.
- Don't nest cards inside cards.
- Don't make a card the only way to reach an important action; include a visible `Button`.
- Don't recolour the border or background with `className`; use `selected` and the theme tokens.
