const fs = require('fs');
const path = require('path');
const tinycolor = require('tinycolor2');

const Theme = require('../components/theme');

const SCSS = fs.readFileSync(path.join(__dirname, '..', 'styles', '_colors.scss'), 'utf8');

// `--v-name: value;` declarations inside the first block that matches `opener`.
const declarations = (opener) => {
  const block = SCSS.match(new RegExp(`${opener}\\s*\\{([^}]*)\\}`));
  const found = {};
  [...block[1].replace(/\/\/.*$/gm, '').matchAll(/(--v-[a-z-]+):\s*([^;]+);/g)].forEach(([, name, value]) => {
    found[name] = value.trim().toLowerCase();
  });
  return found;
};

const stockLight = declarations(':root');
const stockDarkOverrides = declarations('@mixin dark-palette');
const stockDark = { ...stockLight, ...stockDarkOverrides };

// Declared in the stylesheet but not colours a theme sets (animation has its own setters).
const NOT_THEMED = ['--v-anim-speed', '--v-anim-ease'];

const lower = (tokens) => Object.fromEntries(Object.entries(tokens).map(([k, v]) => [k, v.toLowerCase()]));

describe('theme tokens', () => {
  it('are exactly the colour tokens styles/_colors.scss declares', () => {
    const declared = Object.keys(stockLight).filter((name) => !NOT_THEMED.includes(name)).sort();
    expect([...Theme.tokens].sort()).toEqual(declared);
  });

  it('have no duplicates', () => {
    expect(new Set(Theme.tokens).size).toBe(Theme.tokens.length);
  });
});

describe('theme presets', () => {
  const presets = Theme.presets;

  it('have unique ids and names', () => {
    expect(new Set(presets.map((p) => p.id)).size).toBe(presets.length);
    expect(new Set(presets.map((p) => p.name)).size).toBe(presets.length);
  });

  it('are valid themes (known tokens, string values)', () => {
    presets.forEach((preset) => {
      expect(() => Theme.applyTheme(preset)).not.toThrow();
    });
    Theme.resetTheme();
  });

  it('only set known tokens, in both light and dark', () => {
    presets.forEach((preset) => {
      ['light', 'dark'].forEach((scheme) => {
        expect(Object.keys(preset[scheme]).filter((name) => !Theme.tokens.includes(name))).toEqual([]);
      });
    });
  });

  it('start with volta, which lists every token and equals the stylesheet', () => {
    const [volta] = presets;
    expect(volta.id).toBe('volta');
    expect(Object.keys(volta.light).sort()).toEqual([...Theme.tokens].sort());
    expect(Object.keys(volta.dark).sort()).toEqual([...Theme.tokens].sort());
    expect(lower(volta.light)).toEqual(Object.fromEntries(Theme.tokens.map((t) => [t, stockLight[t]])));
    expect(lower(volta.dark)).toEqual(Object.fromEntries(Theme.tokens.map((t) => [t, stockDark[t]])));
  });

  it('has volta-aa, the stock blue moved just far enough to pass, so apps can pick AA without changing colour family', () => {
    const hue = (hex) => Math.round(tinycolor(hex).toHsl().h);
    const aa = presets.find((preset) => preset.id === 'volta-aa');
    expect(aa).toBeDefined();
    ['light', 'dark'].forEach((scheme) => {
      expect(Math.abs(hue(aa[scheme]['--v-accent']) - hue(stockLight['--v-accent']))).toBeLessThanOrEqual(8);
    });
  });

  describe.each(presets.slice(1))('$name', (preset) => {
    // What a theme leaves out falls back to the stock palette.
    const resolve = (scheme) => ({ ...(scheme === 'light' ? stockLight : stockDark), ...lower(preset[scheme]) });
    const ratio = (a, b) => tinycolor.readability(a, b);

    it('sets an accent, its hover and tint, and a label colour in both schemes', () => {
      ['light', 'dark'].forEach((scheme) => {
        ['--v-accent', '--v-accent-hover', '--v-accent-subtle', '--v-on-accent'].forEach((name) => {
          expect(preset[scheme][name]).toMatch(/^#[0-9a-f]{6}$/i);
        });
      });
    });

    it.each(['light', 'dark'])('meets WCAG AA contrast in %s', (scheme) => {
      const t = resolve(scheme);
      // The label on an accent-coloured button
      expect(ratio(t['--v-on-accent'], t['--v-accent'])).toBeGreaterThanOrEqual(4.5);
      // The accent as text, on the page and on its own tint (an active item)
      expect(ratio(t['--v-accent'], t['--v-color-base'])).toBeGreaterThanOrEqual(4.5);
      expect(ratio(t['--v-accent'], t['--v-accent-subtle'])).toBeGreaterThanOrEqual(4.5);
      // Body text, and secondary text (also on the muted surface that panels sit on)
      expect(ratio(t['--v-color-trim'], t['--v-color-base'])).toBeGreaterThanOrEqual(7);
      expect(ratio(t['--v-color-trim-subtle'], t['--v-color-base'])).toBeGreaterThanOrEqual(4.5);
      expect(ratio(t['--v-color-trim-less-subtle'], t['--v-color-base'])).toBeGreaterThanOrEqual(4.5);
      expect(ratio(t['--v-color-trim-less-subtle'], t['--v-color-base-more-subtle'])).toBeGreaterThanOrEqual(4.5);
    });

    it('keeps its neutrals in order: each step is further from the page than the last', () => {
      ['light', 'dark'].forEach((scheme) => {
        const t = resolve(scheme);
        const base = t['--v-color-base'];
        const steps = ['--v-color-base-more-subtle', '--v-color-base-subtle', '--v-color-base-less-subtle'].map(
          (name) => tinycolor.readability(base, t[name])
        );
        expect(steps[0]).toBeLessThan(steps[1]);
        expect(steps[1]).toBeLessThan(steps[2]);
      });
    });
  });
});
