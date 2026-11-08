// styles/tokens.json is generated from styles/_colors.scss (`make tokens`), so a token
// added, renamed or changed in the stylesheet fails here until the file is regenerated.
// `UPDATE_TOKENS=1 npx jest tests/tokensJson.test.js` rewrites it.
import fs from 'fs';
import path from 'path';
import * as Theme from '../components/theme';
import { declarationsIn, colorTokens, tokensJson } from '../util/colorTokens';

const root = path.join(__dirname, '..');
const scss = fs.readFileSync(path.join(root, 'styles', '_colors.scss'), 'utf8');
const file = path.join(root, 'styles', 'tokens.json');

describe('colorTokens', () => {
  const sample = `
    :root {
      --v-a: #111111; // a comment: with; punctuation
      --v-b: 150ms;
    }
    @mixin dark-palette {
      --v-a: #EEEEEE;
    }
    :root[data-theme='dark'] { --v-c: red; }
  `;

  it('reads the declarations of a block, without comments', () => {
    expect(declarationsIn(sample, ':root')).toEqual({ '--v-a': '#111111', '--v-b': '150ms' });
  });

  it('gives each token its light and dark value, the same when dark does not override it', () => {
    expect(colorTokens(sample)).toEqual({
      '--v-a': { light: '#111111', dark: '#EEEEEE' },
      '--v-b': { light: '150ms', dark: '150ms' }
    });
  });

  it('says which block is missing', () => {
    expect(() => declarationsIn('a { b: c }', '@mixin dark-palette')).toThrow('dark-palette');
  });
});

describe('styles/tokens.json', () => {
  if (process.env.UPDATE_TOKENS) fs.writeFileSync(file, tokensJson(scss));

  it('is what styles/_colors.scss generates (run `make tokens` to update it)', () => {
    expect(fs.readFileSync(file, 'utf8')).toBe(tokensJson(scss));
  });

  it('has every token the stylesheet declares, in both schemes', () => {
    const { tokens } = JSON.parse(fs.readFileSync(file, 'utf8'));
    // Every colour a theme can set, plus the animation tokens the stylesheet declares
    expect(Object.keys(tokens).sort()).toEqual([...Theme.tokens, '--v-anim-speed', '--v-anim-ease'].sort());
    Object.values(tokens).forEach(value => {
      expect(typeof value.light).toBe('string');
      expect(typeof value.dark).toBe('string');
    });
    // The dark palette was read, not just the light one
    expect(tokens['--v-color-base'].dark).not.toBe(tokens['--v-color-base'].light);
  });
});
