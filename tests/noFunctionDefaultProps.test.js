// React 19 ignores `defaultProps` on function components when JSX is compiled
// with the automatic runtime (the Vite build), so their defaults silently
// disappear. Use default parameters instead:
//
//   const Thing = ({ size = 'md' }) => ...
//
// Class components still honour `defaultProps`, so they are allowed.

const fs = require('fs');
const path = require('path');

const COMPONENTS = path.join(__dirname, '..', 'components');

const sourceFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return entry.name === 'compiled' ? [] : sourceFiles(full);
  return /\.jsx?$/.test(entry.name) ? [full] : [];
});

describe('components', () => {
  it('give function components their defaults as parameters, not defaultProps', () => {
    const offenders = [];
    sourceFiles(COMPONENTS).forEach((file) => {
      const source = fs.readFileSync(file, 'utf8');
      [...source.matchAll(/^\s*([A-Za-z_$][\w$]*)\.defaultProps\s*=/gm)].forEach(([, name]) => {
        if (!new RegExp(`class\\s+${name}\\b`).test(source)) {
          offenders.push(`${path.relative(COMPONENTS, file)}: ${name}.defaultProps`);
        }
      });
    });
    expect(offenders).toEqual([]);
  });
});
