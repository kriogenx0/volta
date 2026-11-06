const fs = require('fs');
const path = require('path');
const sass = require('sass');

// Motion follows two things: the app's animation speed (--v-anim-speed, set with
// Theme.setAnimationSpeed) and the OS "reduce motion" setting.
//
// 1. styles/_colors.scss turns --v-anim-speed down to almost nothing under
//    `prefers-reduced-motion: reduce`, so everything timed by it follows.
// 2. A transition takes its duration from that variable (or $anim-speed-normal,
//    which is the same thing), never from a literal such as 200ms. `0s` is allowed:
//    it is how a transition is switched off.
// 3. An animation with a literal duration (a keyframe loop) either reacts to
//    prefers-reduced-motion in its own file, or is a progress indicator listed here.

const ROOT = path.join(__dirname, '..');

const stylesheets = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return ['node_modules', 'compiled', 'dist'].includes(entry.name) ? [] : stylesheets(full);
  return /\.scss$/.test(entry.name) ? [full] : [];
});

const withoutComments = (text) => text
  .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '))
  .replace(/\/\/.*$/gm, '');

// Durations written out in a declaration's value, once var(), calc() and $variables
// are removed. Zero is not a duration to worry about.
const literalDurations = (value) => (value
  .replace(/var\([^)]*\)/g, '')
  .replace(/calc\([^)]*\)/g, '')
  .replace(/\$[\w-]+/g, '')
  .match(/(?<![\w.-])\d*\.?\d+(?:ms|s)\b/g) || [])
  .filter((duration) => parseFloat(duration) !== 0);

const declarations = (text, property) => withoutComments(text)
  .split('\n')
  .flatMap((line, index) => {
    const match = line.match(new RegExp(`(?:^|[\\s;{])(?:-\\w+-)?${property}\\s*:\\s*([^;}]*)`));
    return match ? [{ line: index + 1, value: match[1] }] : [];
  });

const files = () => ['components', 'styles', 'styleguide', 'examples'].flatMap((dir) => stylesheets(path.join(ROOT, dir)));

describe('the OS reduce-motion setting', () => {
  const css = sass.compileString(fs.readFileSync(path.join(ROOT, 'styles', '_colors.scss'), 'utf8'), { loadPaths: [ROOT] }).css;
  const block = css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{\s*:root\s*\{([^}]*)\}/);

  it('turns --v-anim-speed down to almost nothing', () => {
    expect(block).not.toBeNull();
    const [, value, unit] = block[1].match(/--v-anim-speed:\s*([\d.]+)(m?s)/);
    const milliseconds = unit === 's' ? parseFloat(value) * 1000 : parseFloat(value);
    expect(milliseconds).toBeLessThanOrEqual(1);
  });

  it('does not make it exactly zero, which would stop animationend (the toast waits for it)', () => {
    const [, value] = block[1].match(/--v-anim-speed:\s*([\d.]+)/);
    expect(parseFloat(value)).toBeGreaterThan(0);
  });
});

describe('transitions', () => {
  it('take their duration from --v-anim-speed, not a literal', () => {
    const offenders = files().flatMap((file) => {
      const text = fs.readFileSync(file, 'utf8');
      return [...declarations(text, 'transition'), ...declarations(text, 'transition-duration')]
        .filter(({ value }) => literalDurations(value).length)
        .map(({ line, value }) => `${path.relative(ROOT, file)}:${line}: ${value.trim()}`);
    });
    expect(offenders).toEqual([]);
  });
});

describe('animations with a literal duration', () => {
  // Looping progress indicators: motion that says "working", which is the point of them.
  const PROGRESS_INDICATORS = {
    'components/Loader/Loader.scss': 'the Loader variants are progress indicators',
    'components/ImagePicker/ImagePicker.scss': 'the ring that turns while a file is read is a progress indicator'
  };

  it('are in a file that reacts to prefers-reduced-motion, or are a listed progress indicator', () => {
    const offenders = files().flatMap((file) => {
      const relative = path.relative(ROOT, file);
      const text = fs.readFileSync(file, 'utf8');
      const timed = [...declarations(text, 'animation'), ...declarations(text, 'animation-duration')]
        .filter(({ value }) => literalDurations(value).length);
      if (!timed.length) return [];
      if (/prefers-reduced-motion/.test(withoutComments(text)) || relative in PROGRESS_INDICATORS) return [];
      return timed.map(({ line, value }) => `${relative}:${line}: ${value.trim()}`);
    });
    expect(offenders).toEqual([]);
  });

  it('gives every listed progress indicator a reason', () => {
    Object.values(PROGRESS_INDICATORS).forEach((reason) => expect(reason.length).toBeGreaterThan(20));
  });
});

describe('the checks themselves', () => {
  it('find a literal duration however it is written, and ignore variables and zero', () => {
    expect(literalDurations('color 200ms')).toEqual(['200ms']);
    expect(literalDurations('opacity .3s ease, color 0.2s')).toEqual(['.3s', '0.2s']);
    expect(literalDurations('all var(--v-anim-speed) ease-in-out')).toEqual([]);
    expect(literalDurations('color $anim-speed-normal')).toEqual([]);
    expect(literalDurations('width calc(var(--v-anim-speed) * 2)')).toEqual([]);
    expect(literalDurations('background-color 0s ease-in-out 0s')).toEqual([]);
    expect(literalDurations('opacity var(--v-anim-speed) 100ms')).toEqual(['100ms']);
  });

  it('read transitions and animations, with or without a vendor prefix, and skip comments', () => {
    expect(declarations('a { transition: color 1s; }', 'transition')).toHaveLength(1);
    expect(declarations('a { -webkit-animation: spin 4s linear; }', 'animation')).toHaveLength(1);
    expect(declarations('// transition: color 1s;\na { color: red; }', 'transition')).toHaveLength(0);
    expect(declarations('a { transition-duration: 1s; }', 'transition')).toHaveLength(0);
  });
});
