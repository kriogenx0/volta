const fs = require('fs');
const path = require('path');

// `!important` wins by force instead of by specificity, so the next rule that needs
// to win has to use it too. Fix the specificity (nest the selector, or use the
// component's own prop) instead.

const ROOT = path.join(__dirname, '..');

const stylesheets = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return ['node_modules', 'compiled', 'dist'].includes(entry.name) ? [] : stylesheets(full);
  return /\.(scss|css)$/.test(entry.name) ? [full] : [];
});

// Comments out, with the line breaks kept so line numbers stay right
const withoutComments = (text) => text
  .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '))
  .replace(/\/\/.*$/gm, '');

const importantLines = (text) => withoutComments(text)
  .split('\n')
  .flatMap((line, index) => (/!\s*important/i.test(line) ? [index + 1] : []));

describe('stylesheets', () => {
  it('do not use !important', () => {
    const offenders = ['components', 'styles', 'styleguide', 'examples']
      .flatMap((dir) => stylesheets(path.join(ROOT, dir)))
      .flatMap((file) => importantLines(fs.readFileSync(file, 'utf8')).map((line) => `${path.relative(ROOT, file)}:${line}`));
    expect(offenders).toEqual([]);
  });

  it('would catch it, however it is spaced, and not a mention in a comment', () => {
    expect(importantLines('a { color: red !important; }')).toEqual([1]);
    expect(importantLines('a {\n  color: red ! important;\n}')).toEqual([2]);
    expect(importantLines('a { color: red !IMPORTANT; }')).toEqual([1]);
    expect(importantLines('// never use !important here\n/* or !important */\na { color: red; }')).toEqual([]);
  });
});
