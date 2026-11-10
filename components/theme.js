import tinycolor from 'tinycolor2';

import { presets } from './themePreset';

export { presets };

// Runtime theming: a theme is plain data (see themePreset.js and
// docs/features/theming.md), applied by setting its tokens as CSS custom
// properties on <html>. Components only ever read the tokens, so applying
// another theme restyles all of them with no rebuild.
//
// Everything that lands on <html> is worked out in one place, render(), from
// three inputs: the applied theme, the colour scheme that is showing (an
// explicit [data-theme] or, for 'system', the OS), and an optional accent
// override from setAccentColor(). Changing any of them calls render(), which
// is how a scheme change picks the other half of a theme and a custom accent
// survives it.

// The tokens a theme may set. Keep in step with the colours declared in
// styles/_colors.scss (tests/themePreset.test.js checks both directions).
export const tokens = [
  '--v-accent',
  '--v-accent-hover',
  '--v-accent-subtle',
  '--v-on-accent',
  '--v-focus-ring',
  '--v-color-base',
  '--v-color-base-subtle',
  '--v-color-base-less-subtle',
  '--v-color-base-more-subtle',
  '--v-color-trim',
  '--v-color-trim-subtle',
  '--v-color-trim-less-subtle',
  '--v-color-trim-more-subtle',
  '--v-color-inactive',
  '--v-color-danger',
  '--v-color-danger-hover',
  '--v-color-success',
  '--v-color-warning',
  '--v-color-danger-subtle'
];

// The page colour when a theme doesn't set --v-color-base.
const STOCK_BASE = { light: '#ffffff', dark: '#050505' };
const SCHEMES = ['light', 'dark'];
const DARK_QUERY = '(prefers-color-scheme: dark)';

const root = () => document.documentElement;

let theme = null; // the applied theme, or null for the stylesheet's own colours
let accentOverride = null; // a colour from setAccentColor(), layered over the theme
let applied = new Set(); // the properties set inline, so they can be removed again
let watching = null; // the matchMedia list followed while the scheme is 'system'

const prefersDark = () => typeof window.matchMedia === 'function' && window.matchMedia(DARK_QUERY).matches;

// scheme: 'light' | 'dark' | 'system'
export function getColorScheme() {
  return root().getAttribute('data-theme') || 'system';
}

// The scheme that is actually showing: 'light' or 'dark'.
const showingScheme = () => {
  const scheme = getColorScheme();
  if (scheme === 'system') return prefersDark() ? 'dark' : 'light';
  return scheme;
};

// Hover, subtle tint and label colour for a single accent. In dark mode the
// tint is the accent sunk into the page colour, not a lightened accent.
function accentTokens(color, scheme, pageColor) {
  const accent = tinycolor(color);
  const dark = scheme === 'dark';
  return {
    '--v-accent': accent.toHexString(),
    '--v-accent-hover': (dark ? accent.clone().lighten(8) : accent.clone().darken(8)).toHexString(),
    '--v-accent-subtle': (dark
      ? tinycolor.mix(pageColor, accent, 45)
      : accent.clone().lighten(38)
    ).toHexString(),
    '--v-on-accent': tinycolor.mostReadable(accent, ['#ffffff', '#0a0a0a']).toHexString()
  };
}

function render() {
  const scheme = showingScheme();
  const next = theme ? { ...theme[scheme] } : {};
  if (accentOverride) {
    Object.assign(next, accentTokens(accentOverride, scheme, next['--v-color-base'] || STOCK_BASE[scheme]));
  }

  const style = root().style;
  applied.forEach((name) => {
    if (!(name in next)) style.removeProperty(name);
  });
  Object.entries(next).forEach(([name, value]) => style.setProperty(name, value));
  applied = new Set(Object.keys(next));

  if (theme) root().setAttribute('data-volta-theme', theme.id);
  else root().removeAttribute('data-volta-theme');

  watchSystemScheme(applied.size > 0);
}

// While a theme or accent is applied and the scheme follows the OS, an OS
// change has to pick the other half of the theme.
function watchSystemScheme(needed) {
  if (typeof window.matchMedia !== 'function') return;
  if (needed && !watching) {
    watching = window.matchMedia(DARK_QUERY);
    if (watching.addEventListener) watching.addEventListener('change', render);
  } else if (!needed && watching) {
    if (watching.removeEventListener) watching.removeEventListener('change', render);
    watching = null;
  }
}

function validate(candidate) {
  if (!candidate || typeof candidate !== 'object' || typeof candidate.id !== 'string' || !candidate.id) {
    throw new TypeError('A theme is an object with an id and light/dark token maps.');
  }
  SCHEMES.forEach((scheme) => {
    Object.entries(candidate[scheme] || {}).forEach(([name, value]) => {
      if (!tokens.includes(name)) {
        throw new Error(`Theme "${candidate.id}" sets unknown token "${name}" (${scheme}). Known tokens: Theme.tokens.`);
      }
      if (typeof value !== 'string') {
        throw new TypeError(`Theme "${candidate.id}" token "${name}" (${scheme}) must be a string.`);
      }
    });
  });
}

// Applies a theme object, or the id of one of Theme.presets. It replaces the
// previous theme and any accent from setAccentColor().
export function applyTheme(next) {
  const found = typeof next === 'string' ? presets.find((preset) => preset.id === next) : next;
  if (typeof next === 'string' && !found) {
    throw new Error(`No theme preset "${next}". Presets: ${presets.map((preset) => preset.id).join(', ')}.`);
  }
  validate(found);
  theme = { id: found.id, name: found.name || found.id, light: found.light || {}, dark: found.dark || {} };
  accentOverride = null;
  render();
}

// Back to the colours in styles/_colors.scss: drops the theme and any accent.
export function resetTheme() {
  theme = null;
  accentOverride = null;
  render();
}

export function getTheme() {
  return theme;
}

// Recolors every component that uses the shared color tokens
// ($color_active / --v-accent) without a rebuild. Layered over the applied
// theme, and kept when the scheme changes.
export function setAccentColor(color) {
  accentOverride = color;
  render();
}

export function resetAccentColor() {
  accentOverride = null;
  render();
}

export function setColorScheme(scheme) {
  if (scheme === 'system') {
    root().removeAttribute('data-theme');
  } else {
    root().setAttribute('data-theme', scheme);
  }
  render();
}

// The shape of the corners. 'rounded' is the stock look; 'square' has none; 'pill'
// rounds controls (buttons, fields, tabs) all the way and soft-corners big surfaces
// (cards, dialogs). Only the --v-radius-* tokens change, by data-shape on <html>
// (styles/_colors.scss), so it is independent of the theme and the colour scheme.
export const shapes = ['square', 'rounded', 'pill'];

export function setShape(shape) {
  if (!shapes.includes(shape)) {
    throw new Error(`No shape "${shape}". Shapes: ${shapes.join(', ')}.`);
  }
  if (shape === 'rounded') root().removeAttribute('data-shape');
  else root().setAttribute('data-shape', shape);
}

export function getShape() {
  return root().getAttribute('data-shape') || 'rounded';
}

export function resetShape() {
  root().removeAttribute('data-shape');
}

// Global speed for every transition/animation built on $anim-speed-normal /
// --v-anim-speed (150ms by default). Accepts a number (ms) or a CSS
// duration string ('0.2s').
export function setAnimationSpeed(speed) {
  const value = typeof speed === 'number' ? `${speed}ms` : speed;
  root().style.setProperty('--v-anim-speed', value);
}

export function resetAnimationSpeed() {
  root().style.removeProperty('--v-anim-speed');
}

export function getAnimationSpeed() {
  return getComputedStyle(root()).getPropertyValue('--v-anim-speed').trim() || '150ms';
}
