const fs = require('fs');
const path = require('path');

// Font Awesome isn't loaded by this library or its styleguide, so an icon drawn
// with `fa fa-*` classes shows nothing unless the host app happens to load it.
// Icons are drawn with the Icon component (inline SVG, needs no font).

const COMPONENTS = path.join(__dirname, '..', 'components');

const PATTERNS = [
  /\bfa fa-/, // class="fa fa-trash"
  /\.fa(-[a-z][a-z-]*)?\s*[{,]/, // a selector: .fa { } or .fa-spin { }
  /\.fa-[a-z]/ // .fa-circle-o-notch, however it is used
];

const sourceFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return entry.name === 'compiled' ? [] : sourceFiles(full);
  return /\.(jsx?|scss)$/.test(entry.name) ? [full] : [];
});

describe('components', () => {
  it('do not draw icons with Font Awesome classes', () => {
    const offenders = [];
    sourceFiles(COMPONENTS).forEach((file) => {
      fs.readFileSync(file, 'utf8').split('\n').forEach((line, index) => {
        if (PATTERNS.some((pattern) => pattern.test(line))) {
          offenders.push(`${path.relative(COMPONENTS, file)}:${index + 1}: ${line.trim().slice(0, 100)}`);
        }
      });
    });
    expect(offenders).toEqual([]);
  });

  it('would catch the patterns it looks for', () => {
    expect(PATTERNS.some((p) => p.test("<i className='fa fa-trash' />"))).toBe(true);
    expect(PATTERNS.some((p) => p.test('  .fa { margin-right: 8px; }'))).toBe(true);
    expect(PATTERNS.some((p) => p.test('  .fa-circle-o-notch'))).toBe(true);
    expect(PATTERNS.some((p) => p.test('<Icon type="trash" />'))).toBe(false);
    expect(PATTERNS.some((p) => p.test('// the Font Awesome classes'))).toBe(false);
  });
});
