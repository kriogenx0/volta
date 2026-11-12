const fs = require('fs');
const path = require('path');

// The shapes (square, rounded, pill) only change the --v-radius-* tokens, so they
// reach a component only if its stylesheet uses the tokens. These read the SCSS source,
// since jsdom loads no CSS.

const ROOT = path.join(__dirname, '..');
const colors = fs.readFileSync(path.join(ROOT, 'styles/_colors.scss'), 'utf8');

const scssFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return entry.name === 'compiled' || entry.name === 'node_modules' ? [] : scssFiles(full);
  return entry.name.endsWith('.scss') ? [full] : [];
});

const block = (selector) => {
  const start = colors.indexOf(selector);
  return colors.slice(start, colors.indexOf('}', start));
};

const radii = (block_) => Object.fromEntries([...block_.matchAll(/--v-radius-(\w+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]));

describe('shapes in styles/_colors.scss', () => {
  it('rounded is the stock look, set on :root', () => {
    expect(radii(block(':root {'))).toEqual({ sm: '2px', md: '4px', lg: '10px', pill: '999px' });
  });

  it('square has no corners at all', () => {
    expect(radii(block(":root[data-shape='square']"))).toEqual({ sm: '0', md: '0', lg: '0', pill: '0' });
  });

  it('pill rounds controls all the way and gives big surfaces softer corners', () => {
    const pill = radii(block(":root[data-shape='pill']"));
    expect(parseInt(pill.md, 10)).toBeGreaterThanOrEqual(20); // more than half a button's height
    expect(parseInt(pill.lg, 10)).toBeGreaterThan(parseInt(pill.md, 10)); // a card is not a capsule
    expect(parseInt(pill.lg, 10)).toBeLessThan(100);
    expect(pill.pill).toBe('999px');
  });
});

// Left as they are on purpose: a phone drawn for an example, and the loaders' animations.
const DRAWINGS = ['components/MobilePhone/', 'components/Loader/'];

describe('component stylesheets', () => {
  const files = [...scssFiles(path.join(ROOT, 'components')), ...scssFiles(path.join(ROOT, 'styles'))]
    .map((file) => path.relative(ROOT, file))
    .filter((file) => !DRAWINGS.some((prefix) => file.startsWith(prefix)));

  it('take every corner from a radius token, so the shape applies to them', () => {
    const offenders = [];
    files.forEach((file) => {
      fs.readFileSync(path.join(ROOT, file), 'utf8').split('\n').forEach((line, index) => {
        if (/^\s*\/\//.test(line)) return;
        const match = line.match(/(?:border(?:-(?:top|bottom)-(?:left|right))?-radius)\s*:\s*([^;]+);/);
        if (!match) return;
        // A literal length is the problem; 0, a percentage (a true circle), inherit and tokens are fine
        const value = match[1].replace(/var\(--v-radius-\w+\)/g, '');
        if (/\d+(\.\d+)?(px|rem|em)\b/.test(value) || /\$border/.test(value)) offenders.push(`${file}:${index + 1} ${line.trim()}`);
      });
    });
    expect(offenders).toEqual([]);
  });

  it('still uses the radius tokens in the places that matter', () => {
    ['components/Button/Button.scss', 'components/TextBox/TextBox.scss', 'components/Card/Card.scss', 'components/Modal/Modal.scss']
      .forEach((file) => expect(fs.readFileSync(path.join(ROOT, file), 'utf8')).toMatch(/var\(--v-radius-(md|lg)\)/));
  });
});

describe('ColorPicker shapes', () => {
  it('rounds its swatches and handles with the pill token, so square makes them square', () => {
    const scss = fs.readFileSync(path.join(ROOT, 'components/ColorPicker/ColorPicker.scss'), 'utf8');
    expect(scss).not.toMatch(/border-radius:\s*50%/);
    expect(scss).toMatch(/color_picker-swatch \{[\s\S]*?border-radius:\s*var\(--v-radius-pill\)/);
  });
});
