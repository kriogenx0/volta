const fs = require('fs');
const path = require('path');
const tinycolor = require('tinycolor2');

const ROOT = path.join(__dirname, '..');
const SCSS = fs.readFileSync(path.join(ROOT, 'styles', '_colors.scss'), 'utf8');
const DESIGN_SYSTEM = fs.readFileSync(path.join(ROOT, 'docs', 'project', 'design-system.md'), 'utf8');

// `--v-name: value;` declarations inside the first block that matches `opener`.
const declarations = (opener) => {
  const block = SCSS.match(new RegExp(`${opener}\\s*\\{([^}]*)\\}`));
  const found = {};
  [...block[1].replace(/\/\/.*$/gm, '').matchAll(/(--v-[a-z0-9-]+):\s*([^;]+);/g)].forEach(([, name, value]) => {
    found[name] = value.trim();
  });
  return found;
};

const light = declarations(':root');
const darkOverrides = declarations('@mixin dark-palette');
const px = (value) => Number(value.replace('px', ''));

describe('spacing tokens', () => {
  const values = [1, 2, 3, 4, 5, 6].map((n) => px(light[`--v-space-${n}`]));

  it('are the six steps of the design system scale', () => {
    // docs/project/design-system.md: "Spacing: 4 / 8 / 12 / 16 / 24 / 32"
    const documented = DESIGN_SYSTEM.match(/Spacing:\s*([\d /]+)/)[1].split('/').map((n) => Number(n.trim()));
    expect(values).toEqual(documented);
  });

  it('only go up', () => {
    values.forEach((value, i) => i && expect(value).toBeGreaterThan(values[i - 1]));
  });
});

describe('radius tokens', () => {
  it('step from tiny to overlay to pill', () => {
    const [sm, md, lg, pill] = ['sm', 'md', 'lg', 'pill'].map((name) => px(light[`--v-radius-${name}`]));
    expect([sm, md, lg]).toEqual([2, 4, 10]); // design-system.md: 2 tiny, 4 default, 10 overlays
    expect(pill).toBeGreaterThan(lg);
  });
});

describe('shadow tokens', () => {
  const alpha = (shadow) => Number(shadow.match(/\/\s*(\d+)%/)[1]);

  it.each(['sm', 'md', 'lg'])('shadow-%s exists and is heavier in dark mode', (size) => {
    const name = `--v-shadow-${size}`;
    expect(light[name]).toMatch(/^0 \d+px \d+px rgb\(0 0 0 \/ \d+%\)$/);
    expect(darkOverrides[name]).toMatch(/^0 \d+px \d+px rgb\(0 0 0 \/ \d+%\)$/);
    expect(alpha(darkOverrides[name])).toBeGreaterThan(alpha(light[name]));
  });

  it('grow in blur from sm to lg', () => {
    const blur = (name) => Number(light[name].match(/^0 \d+px (\d+)px/)[1]);
    expect(blur('--v-shadow-sm')).toBeLessThan(blur('--v-shadow-md'));
    expect(blur('--v-shadow-md')).toBeLessThan(blur('--v-shadow-lg'));
  });
});

describe('layer tokens', () => {
  it('stack nav under modal under popover, so a popover inside a modal shows', () => {
    const [nav, modal, popover] = ['nav', 'modal', 'popover'].map((name) => Number(light[`--v-z-${name}`]));
    expect(nav).toBeLessThan(modal);
    expect(modal).toBeLessThan(popover);
  });
});

describe('colour tokens added with the scales', () => {
  it('focus ring follows the accent until a theme sets it', () => {
    expect(light['--v-focus-ring']).toBe('var(--v-accent)');
  });

  it('the danger hover is darker than danger and keeps a readable white label', () => {
    expect(tinycolor(light['--v-color-danger-hover']).getLuminance()).toBeLessThan(tinycolor(light['--v-color-danger']).getLuminance());
    expect(tinycolor.readability('#ffffff', light['--v-color-danger-hover'])).toBeGreaterThanOrEqual(4.5);
  });
});
