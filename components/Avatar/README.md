# Avatar

A round picture of a person, or their initials when there is no picture.

## When to use

- **Showing who someone is** next to a name, a comment, a list row or a menu.
- Not for a logo or a product image; use a plain `<img>`.
- A count or status marker on top of something is a [`Badge`](../Badge/README.md) or an [`IndicatorDot`](../IndicatorDot/README.md).

## Usage

```jsx
import { Avatar } from 'volta';

<>
  <Avatar name="Ada Lovelace" photoUrl="/people/ada.jpg" />
  <Avatar name="Grace Hopper" />
  <Avatar name="Alan Turing" size="sm" />
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `name` | `string` | | The person's name. Gives the initials when there is no photo, and the accessible name in both cases. |
| `photoUrl` | `string` | | URL of the picture. When it is set, the picture is shown and the initials are not. |
| `size` | `'sm'` \| `'md'` | `'md'` | 28px or 36px across. `Avatar.sizes` lists them. |
| `color` | `string` | `'auto'` | The background of the initials. `'auto'` makes a colour from the name; `'accent'` is the theme's accent; any CSS colour is used as it is. Ignored when there is a photo. |

## Colour from the name

By default (`color="auto"`) the background is worked out from the name, so a person is the same colour on every screen and every visit, with nothing stored. The name is normalised first (case, extra spaces and accents are ignored: "José Núñez" and "jose nunez" match), hashed to a hue, and the lightness is lowered until white initials read on it at 4.5:1. A blank name has no colour and falls back to the accent. The functions are in `components/Avatar/avatarColor.js`. The text colour for a colour you give is white or near-black, whichever reads better.

## Variants and states

- **Photo:** an `<img>` cropped to a circle (`object-fit: cover`).
- **Initials:** the first letter of the first two words of `name`, in capitals ("Ada Lovelace" is "AL", "Plato" is "P"), on the accent colour (`--v-accent`) with `--v-on-accent` text.
- **No name and no photo:** an empty accent circle. It does not throw.
- There is no fallback to the initials if the photo fails to load; the browser's broken-image icon shows instead.

## Accessibility

- A photo's `alt` is the name, so a lone avatar says who it is. The initials circle is `role="img"` with `aria-label` set to the name.
- With no `name` the avatar has no accessible name; pass one whenever the avatar is not purely decorative.
- If the name is already written next to the avatar, the repeat is harmless but a screen reader will read it twice.
- The initials use `--v-on-accent`, the token for text on the accent colour, which is set at runtime.

## Do and don't

- Do pass `name` every time, even with a photo.
- Do use `sm` in dense lists and `md` elsewhere; there are no other sizes.
- Don't resize it with CSS; use `size`. It takes no `className`.
- Don't make it the only way to tell people apart; two people can share initials.
- Don't use it as a button on its own. Wrap it in a `Button` or link that has its own label.
