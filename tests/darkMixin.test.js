const fs = require('fs');
const path = require('path');
const sass = require('sass');

const ROOT = path.join(__dirname, '..');

// A rule written with `@include dark` has to follow an explicit
// Theme.setColorScheme('dark'|'light') as well as the OS preference. A bare
// `@media (prefers-color-scheme: dark)` follows the OS only, so it keeps
// applying after the user picks light.

const MARKER = '/* probe */';

const compile = (source) => sass.compileString(`@use "mixins" as *;\n${MARKER}\n${source}`, { loadPaths: [ROOT] }).css;

// Only the rules the probe wrote, without the colour tokens `mixins` pulls in.
const probeRules = (css) => css.slice(css.indexOf(MARKER) + MARKER.length);

describe('the dark mixin', () => {
  it('applies under an explicit dark scheme', () => {
    const css = probeRules(compile('.probe { color: red; @include dark { color: white; } }'));
    expect(css).toMatch(/:root\[data-theme=dark\] \.probe\s*\{\s*color: white;/);
  });

  it('follows the OS only while no scheme has been chosen', () => {
    const css = probeRules(compile('.probe { color: red; @include dark { color: white; } }'));
    expect(css).toMatch(/@media \(prefers-color-scheme: dark\)\s*\{\s*:root:not\(\[data-theme\]\) \.probe\s*\{\s*color: white;/);
  });

  it('never applies under an explicit light scheme', () => {
    const css = probeRules(compile('.probe { color: red; @include dark { color: white; } }'));
    const darkRules = css.split('}').filter((rule) => rule.includes('color: white'));
    expect(darkRules.length).toBeGreaterThan(0);
    darkRules.forEach((rule) => {
      expect(rule).toMatch(/:root:not\(\[data-theme\]\) \.probe|:root\[data-theme=dark\] \.probe/);
    });
    expect(css).not.toMatch(/data-theme=light/);
  });

  it('keeps the whole selector when nested', () => {
    const css = probeRules(compile('.probe { .title { &:hover { @include dark { color: white; } } } }'));
    expect(css).toContain(':root[data-theme=dark] .probe .title:hover');
    expect(css).toContain(':root:not([data-theme]) .probe .title:hover');
  });
});

describe('stylesheets', () => {
  const scssFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return ['node_modules', 'compiled', 'dist'].includes(entry.name) ? [] : scssFiles(full);
    return /\.s?css$/.test(entry.name) ? [full] : [];
  });

  it('use @include dark, not their own prefers-color-scheme query', () => {
    const allowed = [path.join('styles', '_colors.scss'), path.join('styles', '_mixins.scss')];
    const offenders = ['components', 'styles', 'styleguide', 'examples']
      .flatMap((dir) => scssFiles(path.join(ROOT, dir)))
      .map((file) => path.relative(ROOT, file))
      .filter((file) => !allowed.includes(file))
      .filter((file) => /^[^/\n]*@media[^\n]*prefers-color-scheme/m.test(fs.readFileSync(path.join(ROOT, file), 'utf8')));
    expect(offenders).toEqual([]);
  });
});
