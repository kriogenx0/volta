const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

// Button's old ways of choosing its look (`bsStyle`, `tiny`, and `type` set to a
// variant name) still work for apps that use them, and warn. Nothing in this
// repository should use them: use `variant` and `size`.

const ROOT = path.join(__dirname, '..');
const VARIANTS = ['default', 'primary', 'link', 'danger'];

const sourceFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return ['node_modules', 'compiled', 'dist'].includes(entry.name) ? [] : sourceFiles(full);
  return /\.jsx?$/.test(entry.name) ? [full] : [];
});

const attributeValue = (attribute) => {
  const { value } = attribute;
  if (!value) return true;
  if (value.type === 'StringLiteral') return value.value;
  if (value.type === 'JSXExpressionContainer' && value.expression.type === 'StringLiteral') return value.expression.value;
  return undefined;
};

// <Button ...> elements, found anywhere in a parsed file, that use a legacy attribute
const legacyUses = (code) => {
  const found = [];
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(visit); return; }
    if (node.type === 'JSXOpeningElement' && node.name.name === 'Button') {
      node.attributes.forEach((attribute) => {
        if (attribute.type !== 'JSXAttribute') return;
        const name = attribute.name.name;
        const value = attributeValue(attribute);
        if (name === 'bsStyle' || name === 'tiny' || (name === 'type' && VARIANTS.includes(value))) {
          found.push(`${name}${typeof value === 'string' ? `="${value}"` : ''} (line ${node.loc.start.line})`);
        }
      });
    }
    Object.keys(node).forEach((key) => { if (key !== 'loc') visit(node[key]); });
  };
  visit(parser.parse(code, { sourceType: 'module', plugins: ['jsx', 'flow'] }));
  return found;
};

describe('the repository', () => {
  it('does not use Button\'s deprecated props', () => {
    const offenders = ['components', 'examples', 'styleguide'].flatMap((dir) => sourceFiles(path.join(ROOT, dir)))
      .flatMap((file) => {
        let uses;
        try { uses = legacyUses(fs.readFileSync(file, 'utf8')); } catch (error) { return []; }
        return uses.map((use) => `${path.relative(ROOT, file)}: ${use}`);
      });
    expect(offenders).toEqual([]);
  });

  it('would find each legacy way, on one line or several', () => {
    expect(legacyUses('const a = <Button tiny>x</Button>;')).toEqual(['tiny (line 1)']);
    expect(legacyUses("const a = <Button bsStyle='primary'>x</Button>;")).toEqual(['bsStyle="primary" (line 1)']);
    expect(legacyUses('const a = (\n  <Button\n    onClick={go}\n    type="primary"\n  >x</Button>\n);')).toEqual(['type="primary" (line 2)']);
    expect(legacyUses("const a = <Button type={'danger'}>x</Button>;")).toEqual(['type="danger" (line 1)']);
  });

  it('leaves the modern props and the HTML types alone', () => {
    expect(legacyUses('const a = <Button variant="primary" size="tiny" type="submit">x</Button>;')).toEqual([]);
    expect(legacyUses('const a = <Loader tiny small />;')).toEqual([]);
  });
});
