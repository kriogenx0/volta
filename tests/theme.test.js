import * as Theme from '../components/theme';

describe('Theme', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Theme.resetTheme();
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

  describe('themes', () => {
    const token = (name) => document.documentElement.style.getPropertyValue(name);

    // Fakes the OS colour scheme and returns a function that flips it.
    const mockSystemScheme = (dark) => {
      let matches = dark;
      const listeners = [];
      window.matchMedia = () => ({
        get matches() { return matches; },
        addEventListener: (_type, fn) => listeners.push(fn),
        removeEventListener: (_type, fn) => listeners.splice(listeners.indexOf(fn), 1)
      });
      return {
        flip: () => { matches = !matches; listeners.slice().forEach((fn) => fn()); },
        listeners
      };
    };

    const theme = {
      id: 'test',
      name: 'Test',
      light: { '--v-accent': '#aa0000', '--v-color-base': '#fffff0' },
      dark: { '--v-accent': '#ff8888', '--v-color-base': '#101000' }
    };

    it('lists the presets and the tokens a theme may set', () => {
      expect(Theme.presets.length).toBeGreaterThan(1);
      expect(Theme.tokens).toContain('--v-accent');
      expect(Theme.getTheme()).toBeNull();
    });

    it('applies the light half of a theme as custom properties', () => {
      Theme.setColorScheme('light');
      Theme.applyTheme(theme);
      expect(token('--v-accent')).toBe('#aa0000');
      expect(token('--v-color-base')).toBe('#fffff0');
      expect(document.documentElement.getAttribute('data-volta-theme')).toBe('test');
      expect(Theme.getTheme().id).toBe('test');
    });

    it('applies a preset by id', () => {
      Theme.applyTheme('ocean');
      expect(Theme.getTheme().id).toBe('ocean');
      expect(token('--v-accent')).not.toBe('');
    });

    it('picks the dark half when the scheme is dark, and switches with the scheme', () => {
      Theme.applyTheme(theme);
      Theme.setColorScheme('dark');
      expect(token('--v-accent')).toBe('#ff8888');
      expect(token('--v-color-base')).toBe('#101000');
      Theme.setColorScheme('light');
      expect(token('--v-accent')).toBe('#aa0000');
    });

    it('follows the OS scheme while the scheme is system, including when it changes', () => {
      const os = mockSystemScheme(true);
      Theme.applyTheme(theme);
      expect(token('--v-accent')).toBe('#ff8888');
      os.flip();
      expect(token('--v-accent')).toBe('#aa0000');
    });

    it('stops following the OS once nothing is applied', () => {
      const os = mockSystemScheme(false);
      Theme.applyTheme(theme);
      expect(os.listeners).toHaveLength(1);
      Theme.resetTheme();
      expect(os.listeners).toHaveLength(0);
    });

    it('removes the tokens the next theme does not set', () => {
      Theme.setColorScheme('light');
      Theme.applyTheme('volta');
      expect(token('--v-color-trim')).not.toBe('');
      Theme.applyTheme('ocean');
      expect(token('--v-color-trim')).toBe('');
      expect(token('--v-accent')).not.toBe('');
    });

    it('resets to the stylesheet colours', () => {
      Theme.applyTheme(theme);
      Theme.resetTheme();
      expect(token('--v-accent')).toBe('');
      expect(document.documentElement.hasAttribute('data-volta-theme')).toBe(false);
      expect(Theme.getTheme()).toBeNull();
    });

    it('leaves the animation speed alone', () => {
      Theme.setAnimationSpeed(300);
      Theme.applyTheme(theme);
      Theme.resetTheme();
      expect(token('--v-anim-speed')).toBe('300ms');
    });

    it('layers a custom accent over the theme and keeps it across a scheme change', () => {
      Theme.setColorScheme('light');
      Theme.applyTheme(theme);
      Theme.setAccentColor('#00aa00');
      expect(token('--v-accent')).toBe('#00aa00');
      expect(token('--v-color-base')).toBe('#fffff0');
      Theme.setColorScheme('dark');
      expect(token('--v-accent')).toBe('#00aa00');
      expect(token('--v-color-base')).toBe('#101000');
      Theme.resetAccentColor();
      expect(token('--v-accent')).toBe('#ff8888');
    });

    it('replaces a custom accent when another theme is applied', () => {
      Theme.setAccentColor('#00aa00');
      Theme.applyTheme(theme);
      expect(token('--v-accent')).not.toBe('#00aa00');
    });

    it('derives a dark tint for a custom accent in dark mode, not a light one', () => {
      Theme.setColorScheme('dark');
      Theme.setAccentColor('#4a90e2');
      const luminance = (hex) => parseInt(hex.slice(1, 3), 16) + parseInt(hex.slice(3, 5), 16) + parseInt(hex.slice(5, 7), 16);
      expect(luminance(token('--v-accent-subtle'))).toBeLessThan(luminance(token('--v-accent')));
      Theme.setColorScheme('light');
      expect(luminance(token('--v-accent-subtle'))).toBeGreaterThan(luminance(token('--v-accent')));
    });

    it('picks a readable label colour for a custom accent', () => {
      Theme.setAccentColor('#ffd400');
      expect(token('--v-on-accent')).toBe('#0a0a0a');
      Theme.setAccentColor('#102a6b');
      expect(token('--v-on-accent')).toBe('#ffffff');
    });

    it('rejects things that are not themes, with a message that says what is wrong', () => {
      expect(() => Theme.applyTheme('nope')).toThrow(/No theme preset "nope"/);
      expect(() => Theme.applyTheme({ light: {} })).toThrow(/with an id/);
      expect(() => Theme.applyTheme(null)).toThrow(/with an id/);
      expect(() => Theme.applyTheme({ id: 'x', light: { '--v-acent': '#fff' } })).toThrow(/unknown token "--v-acent"/);
      expect(() => Theme.applyTheme({ id: 'x', dark: { '--v-accent': 12 } })).toThrow(/must be a string/);
      expect(Theme.getTheme()).toBeNull();
    });

    it('accepts a theme with only one of light and dark', () => {
      Theme.setColorScheme('dark');
      Theme.applyTheme({ id: 'light-only', light: { '--v-accent': '#123456' } });
      expect(token('--v-accent')).toBe('');
    });
  });
});
