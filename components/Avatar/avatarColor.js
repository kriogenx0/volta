import tinycolor from 'tinycolor2';

// The colour an Avatar takes from a name, so the same name is the same colour on
// every screen and every visit, with nothing stored. Pure functions, so they are
// easy to test (docs/features/avatar.md).

const SATURATION = 0.55;
const START_LIGHTNESS = 0.48;
const MIN_LIGHTNESS = 0.2;
const WHITE = '#ffffff';
const DARK = '#0a0a0a';

// The same person, however the name is typed: case, spaces and accents don't matter.
export const normalizeName = (name) => String(name || '')
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .split(/\s+/)
  .filter(Boolean)
  .join(' ');

// 0 to 359, from a hash of the name (djb2, so it is the same everywhere).
export const nameHue = (name) => {
  let hash = 5381;
  Array.from(normalizeName(name)).forEach((char) => {
    hash = ((hash * 33) + char.codePointAt(0)) >>> 0;
  });
  return hash % 360;
};

// A solid colour for the name, dark enough that white initials read on it (4.5:1).
// A blank name has no colour: null, and the caller uses the accent.
export const colorFromName = (name) => {
  if (!normalizeName(name)) return null;
  const hue = nameHue(name);
  let lightness = START_LIGHTNESS;
  let color = tinycolor({ h: hue, s: SATURATION, l: lightness });
  while (lightness > MIN_LIGHTNESS && tinycolor.readability(WHITE, color) < 4.5) {
    lightness -= 0.02;
    color = tinycolor({ h: hue, s: SATURATION, l: lightness });
  }
  return color.toHexString();
};

// The text colour for any background: white or near-black, whichever reads better.
export const readableOn = (background) => tinycolor.mostReadable(background, [WHITE, DARK]).toHexString();

// What an Avatar draws with for its `color` prop: the colours to use, or null for
// the accent. 'accent' is the accent; 'auto' comes from the name; anything else
// is a CSS colour, used as it is.
export const avatarColors = (color, name) => {
  if (!color || color === 'accent') return null;
  const background = color === 'auto' ? colorFromName(name) : (tinycolor(color).isValid() ? tinycolor(color).toHexString() : null);
  return background ? { background, text: readableOn(background) } : null;
};
