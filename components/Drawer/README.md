# Drawer

A panel that slides in from the right edge over a scrim, for a side form or a detail view.

## When to use

- **A form or detail that belongs to the current page** (filters, an edit form, a record's details) and should keep the page visible behind it.
- A blocking question with Save and Cancel is a [`Dialog`](../Dialog/README.md). A short message is a `Message`.
- It has no header, no title and no close button of its own; put the content, and a [`CloseButton`](../CloseButton/README.md), inside.

## Usage

```jsx
import { Button, CloseButton, Drawer } from 'volta';

<>
  <Button onClick={openFilters}>Filters</Button>
  <Drawer open={filtersOpen} label="Filters" width="320px" onClose={closeFilters}>
    <CloseButton aria-label="Close filters" onClick={closeFilters} />
    <FilterForm />
  </Drawer>
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `open` | `bool` | `false` | Shows the drawer. The parent owns this state. |
| `onClose` | `function` | | Called on a click on the scrim and on Escape. It does not close anything itself; set `open` to `false` in it. |
| `width` | `string` | `'50%'` | Any CSS width (`'320px'`, `'100%'`). A percentage is of the drawer's positioned ancestor. |
| `label` | `string` | | The panel's accessible name. |
| `className` | `string` | | Added to the root, after `volta-drawer`. |
| `children` | `node` | | The content. It scrolls inside the panel when it is taller. |

## Behaviour

- The drawer covers its nearest positioned ancestor (it is `position: absolute` with all four sides at 0), slides the panel in from that ancestor's right edge, and dims the rest with a scrim. Give the container `position: relative`, or it will cover whatever positioned ancestor is next up, up to the whole page.
- While closed it is `visibility: hidden` after the slide-out, so it is skipped by the pointer, the keyboard and screen readers.
- The width does not change with the screen. On a phone the default `50%` is narrow; pass `width="100%"` there.

## Accessibility

- The panel is `role="dialog"` with `aria-label` from `label`. Pass a `label`, or it has no name.
- Escape (while open) and a click on the scrim call `onClose`. Offer a visible close control as well, such as a `CloseButton`.
- It does not move focus into the panel on open, does not trap it and does not return it on close. Move focus into the drawer yourself (to its first field or heading) and back to the trigger when it closes.
- It is not marked `aria-modal`, so the page behind stays in the reading order while it is open.

## Do and don't

- Do give the drawer a `label` and a visible close button.
- Do keep `open` in the parent and set it to `false` in `onClose`.
- Don't use it for a message that needs an answer before anything else can happen; use a `Dialog`.
- Don't nest drawers.
- Don't hard-code the panel's colours; it uses the theme tokens (`--v-color-base` background, `--v-color-trim` text) in both themes.
