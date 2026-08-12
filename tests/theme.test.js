import * as Theme from '../components/theme';

describe('Theme', () => {
  afterEach(() => {
    Theme.resetAccentColor();
    Theme.resetAnimationSpeed();
    Theme.setColorScheme('system');
  });

  it('sets the accent color as a CSS custom property on the root element', () => {
    Theme.setAccentColor('#ff0000');
    expect(document.documentElement.style.getPropertyValue('--v-accent')).toBe('#ff0000');
  });

  it('derives a hover and subtle variant from the accent color', () => {
    Theme.setAccentColor('#4a90e2');
    expect(document.documentElement.style.getPropertyValue('--v-accent-hover')).not.toBe('');
    expect(document.documentElement.style.getPropertyValue('--v-accent-subtle')).not.toBe('');
  });

  it('resets the accent color custom properties', () => {
    Theme.setAccentColor('#ff0000');
    Theme.resetAccentColor();
    expect(document.documentElement.style.getPropertyValue('--v-accent')).toBe('');
  });

  it('defaults to the system color scheme', () => {
    expect(Theme.getColorScheme()).toBe('system');
  });

  it('sets an explicit color scheme via the data-theme attribute', () => {
    Theme.setColorScheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(Theme.getColorScheme()).toBe('dark');
  });

  it('removes the data-theme attribute when reset to system', () => {
    Theme.setColorScheme('dark');
    Theme.setColorScheme('system');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('sets the animation speed from a number of milliseconds', () => {
    Theme.setAnimationSpeed(300);
    expect(document.documentElement.style.getPropertyValue('--v-anim-speed')).toBe('300ms');
  });

  it('sets the animation speed from a CSS duration string', () => {
    Theme.setAnimationSpeed('0.5s');
    expect(document.documentElement.style.getPropertyValue('--v-anim-speed')).toBe('0.5s');
  });

  it('defaults to 150ms when unset', () => {
    expect(Theme.getAnimationSpeed()).toBe('150ms');
  });
});
