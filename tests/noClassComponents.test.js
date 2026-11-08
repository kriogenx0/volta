// The design system asks for function components with hooks (docs/project/design-system.md,
// rule 15). The only classes allowed are error boundaries, which React still requires to be
// classes, and the ones listed below until they are converted.
//
// Both ways: a new class component fails, and so does a name left in the list after the
// class was converted, so the list can only shrink.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FOLDERS = ['components', 'styleguide', 'util'];

// Class components still to convert (docs/backlog/convert-class-components-to-hooks.md).
// Map waits for docs/backlog/google-maps-key-to-config.md, which edits the same file.
const NOT_CONVERTED_YET = ['components/Map/Map.jsx: Map'];

const sourceFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return ['compiled', 'dist', 'node_modules'].includes(entry.name) ? [] : sourceFiles(full);
  return /\.jsx?$/.test(entry.name) ? [full] : [];
});

// Names of the class components in some source that are not error boundaries.
const classComponents = (source) => {
  const found = [];
  const re = /class\s+([A-Za-z_$][\w$]*)\s+extends\s+(?:React\.)?(?:Pure)?Component\b/g;
  let match;
  while ((match = re.exec(source))) {
    // The class body runs to the next class (or the end of the file)
    const next = source.indexOf('\nclass ', match.index + 1);
    const body = source.slice(match.index, next === -1 ? source.length : next);
    if (!/componentDidCatch|getDerivedStateFromError/.test(body)) found.push(match[1]);
  }
  return found;
};

describe('classComponents', () => {
  it('finds a class component', () => {
    expect(classComponents('export default class Thing extends React.Component { render() {} }')).toEqual(['Thing']);
    expect(classComponents('class A extends Component {}\nclass B extends PureComponent {}')).toEqual(['A', 'B']);
  });

  it('skips error boundaries, with either of their lifecycle methods', () => {
    expect(classComponents('class Boundary extends React.Component { componentDidCatch() {} }')).toEqual([]);
    expect(classComponents('class Boundary extends React.Component { static getDerivedStateFromError() {} }')).toEqual([]);
  });

  it('judges each class on its own body', () => {
    const source = 'class Boundary extends React.Component { componentDidCatch() {} }\nclass Plain extends React.Component {}';
    expect(classComponents(source)).toEqual(['Plain']);
  });

  it('ignores classes that are not components', () => {
    expect(classComponents('class Store { constructor() {} }')).toEqual([]);
  });
});

describe('the code base', () => {
  it('has no class components except the ones still to convert', () => {
    const found = FOLDERS.flatMap((folder) => sourceFiles(path.join(ROOT, folder)).flatMap((file) => (
      classComponents(fs.readFileSync(file, 'utf8')).map((name) => `${path.relative(ROOT, file)}: ${name}`)
    ))).sort();
    expect(found).toEqual([...NOT_CONVERTED_YET].sort());
  });
});
