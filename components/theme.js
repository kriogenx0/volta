import tinycolor from 'tinycolor2';

const root = () => document.documentElement;

// Recolors every component that uses the shared color tokens
// ($color_active / --v-accent) without a rebuild.
export function setAccentColor(color) {
  const accent = tinycolor(color);
  const styles = root().style;

  styles.setProperty('--v-accent', accent.toHexString());
  styles.setProperty('--v-accent-hover', accent.clone().darken(8).toHexString());
  styles.setProperty('--v-accent-subtle', accent.clone().lighten(38).toHexString());
}

export function resetAccentColor() {
  const styles = root().style;
  styles.removeProperty('--v-accent');
  styles.removeProperty('--v-accent-hover');
  styles.removeProperty('--v-accent-subtle');
}

// scheme: 'light' | 'dark' | 'system'
export function setColorScheme(scheme) {
  if (scheme === 'system') {
    root().removeAttribute('data-theme');
  } else {
    root().setAttribute('data-theme', scheme);
  }
}

export function getColorScheme() {
  return root().getAttribute('data-theme') || 'system';
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
