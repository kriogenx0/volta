const fs = require('fs');
const path = require('path');
const tinycolor = require('tinycolor2');

// The stock palette's text and label pairings, against WCAG AA (4.5:1).
//
// Pairs that fail today are listed in KNOWN_BELOW_AA. Each is a decision for the
// owner (docs/backlog/resolve-contrast-failures.md), not an oversight. This is a
// ratchet: a new failure fails the test, and so does fixing a listed one without
// removing it from the list, so the list stays an exact record of what is open.
// `--v-color-inactive` is left out on purpose: it is for disabled and inactive
// things, which WCAG exempts, and never carries essential information.

const SCSS = fs.readFileSync(path.join(__dirname, '..', 'styles', '_colors.scss'), 'utf8');

const declarations = (opener) => {
  const block = SCSS.match(new RegExp(`${opener}\\s*\\{([^}]*)\\}`));
  const found = {};
  [...block[1].replace(/\/\/.*$/gm, '').matchAll(/(--v-[a-z-]+):\s*([^;]+);/g)].forEach(([, name, value]) => {
    found[name] = value.trim();
  });
  return found;
};

const light = declarations(':root');
const dark = { ...light, ...declarations('@mixin dark-palette') };

const PAIRS = [
  ['trim on the page', '--v-color-trim', '--v-color-base'],
  ['trim-subtle on the page', '--v-color-trim-subtle', '--v-color-base'],
  ['trim-less-subtle on the page', '--v-color-trim-less-subtle', '--v-color-base'],
  ['trim-less-subtle on the muted surface', '--v-color-trim-less-subtle', '--v-color-base-more-subtle'],
  ['accent as text on the page', '--v-accent', '--v-color-base'],
  ['accent on its tint', '--v-accent', '--v-accent-subtle'],
  ['label on the accent', '--v-on-accent', '--v-accent'],
  ['danger as text on the page', '--v-color-danger', '--v-color-base'],
  ['danger on its tint', '--v-color-danger', '--v-color-danger-subtle'],
  ['label on danger', '--v-on-accent', '--v-color-danger'],
  ['success as text on the page', '--v-color-success', '--v-color-base'],
  ['warning as text on the page', '--v-color-warning', '--v-color-base']
];

const KNOWN_BELOW_AA = {
  light: [
    'accent as text on the page', // 3.29
    'accent on its tint', // 2.85
    'label on the accent', // 3.29
    'success as text on the page' // 3.44
  ],
  dark: [
    'accent on its tint', // 2.75
    'label on the accent', // 3.29
    'danger as text on the page', // 4.14
    'danger on its tint', // 3.28
    'warning as text on the page' // 3.93
  ]
};

const failing = (palette) => PAIRS
  .filter(([, text, ground]) => tinycolor.readability(palette[text], palette[ground]) < 4.5)
  .map(([label]) => label)
  .sort();

describe('the stock palette', () => {
  it.each([['light', light], ['dark', dark]])('fails AA in %s only where it is known to', (scheme, palette) => {
    expect(failing(palette)).toEqual([...KNOWN_BELOW_AA[scheme]].sort());
  });

  it('keeps body and secondary text at AA on the page in light and dark', () => {
    [light, dark].forEach((palette) => {
      ['--v-color-trim', '--v-color-trim-subtle', '--v-color-trim-less-subtle'].forEach((text) => {
        expect(tinycolor.readability(palette[text], palette['--v-color-base'])).toBeGreaterThanOrEqual(4.5);
      });
    });
  });
});
