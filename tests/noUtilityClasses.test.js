// Tailwind isn't part of this repo's build, so utility classes in a component
// do nothing here (see docs/project/design-system.md, "Never"). Style
// components with SCSS and the --v-* tokens instead.

const fs = require('fs');
const path = require('path');

const COMPONENTS = path.join(__dirname, '..', 'components');

// Narrow on purpose: these shapes only show up in Tailwind utilities, not in
// this library's own class names.
const UTILITY = [
  /['"` ](?:dark|hover|focus|disabled):[a-z-]+/,
  /['"` ](?:bg|text|border|divide)-(?:gray|red|green|orange|blue|white|black)(?:-\d+)?[\s'"`/]/,
  /['"` ](?:px|py|pt|pb|pl|pr|mt|mb)-\d/,
  /['"` ]rounded-(?:sm|md|lg|xl|full)[\s'"`]/,
  /['"` ](?:inline-flex|items-center|justify-between|justify-center)[\s'"`]/
];

const sourceFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return entry.name === 'compiled' ? [] : sourceFiles(full);
  return /\.jsx?$/.test(entry.name) ? [full] : [];
});

describe('components', () => {
  it('contain no Tailwind-style utility classes', () => {
    const offenders = [];
    sourceFiles(COMPONENTS).forEach((file) => {
      fs.readFileSync(file, 'utf8').split('\n').forEach((line, index) => {
        if (UTILITY.some((pattern) => pattern.test(line))) {
          offenders.push(`${path.relative(COMPONENTS, file)}:${index + 1}: ${line.trim().slice(0, 100)}`);
        }
      });
    });
    expect(offenders).toEqual([]);
  });
});
