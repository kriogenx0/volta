const fs = require('fs');
const path = require('path');

// The design system says never use pt units (docs/project/design-system.md, "Never"):
// a point is a print unit, and the rest of the type scale is in px. The stylesheets
// that still use them are listed with how many times, so they can be fixed one at a
// time. A ratchet: a new pt fails, and so does a listed count that has gone down
// without the list being updated.

const ROOT = path.join(__dirname, '..');

const stylesheets = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return ['node_modules', 'compiled', 'dist'].includes(entry.name) ? [] : stylesheets(full);
  return /\.scss$/.test(entry.name) ? [full] : [];
});

const withoutComments = (text) => text
  .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '))
  .replace(/\/\/.*$/gm, '');

// A number straight followed by pt: 10pt, 11.5pt, .5pt
const ptUses = (text) => (withoutComments(text).match(/(?<![\w.-])\d*\.?\d+pt\b/g) || []).length;

// stylesheet -> how many pt values it has today
const KNOWN = {
  'components/Button/Button.scss': 3,
  'components/IndicatorDot/IndicatorDot.scss': 2
};

const counts = () => Object.fromEntries(
  ['components', 'styles', 'styleguide', 'examples']
    .flatMap((dir) => stylesheets(path.join(ROOT, dir)))
    .map((file) => [path.relative(ROOT, file), ptUses(fs.readFileSync(file, 'utf8'))])
    .filter(([, count]) => count > 0)
);

describe('pt units', () => {
  const found = counts();

  it('are in no stylesheet that is not already listed', () => {
    expect(Object.keys(found).filter((file) => !(file in KNOWN))).toEqual([]);
  });

  it('are no more frequent in a listed stylesheet than they were', () => {
    expect(Object.entries(found).filter(([file, count]) => file in KNOWN && count > KNOWN[file]).map(([file]) => file)).toEqual([]);
  });

  it('are still where the list says, so it shrinks as they are fixed', () => {
    expect(Object.entries(KNOWN).filter(([file, count]) => found[file] !== count).map(([file]) => file)).toEqual([]);
  });

  it('has the check itself right: units, decimals and comments', () => {
    expect(ptUses('a { font-size: 10pt; }')).toBe(1);
    expect(ptUses('a { font-size: 11.5pt; margin: .5pt 8pt; }')).toBe(3);
    expect(ptUses('a { font-size: 12px; width: 100%; } // 10pt\n/* 14pt */')).toBe(0);
    expect(ptUses('a { content: "10pt"; font-size: 1rem; --opt: 0; }')).toBe(1);
    expect(ptUses('a { transition: opacity 1s; background: #fffpt; }')).toBe(0);
  });
});
