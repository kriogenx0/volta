// Every component that components/index.js exports has a guideline at
// components/<Dir>/README.md (format: docs/features/component_guidelines.md).
// The README is checked against the code so it can't drift: the headings are all
// there, the props table lists every one of the component's propTypes, and the Usage
// example parses and imports only names the library exports. A props table may also
// list props the component reads but doesn't declare (onClick, children, ...), as long
// as the name appears in the component's source.
import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import * as volta from '../components';

const componentsDir = path.resolve(__dirname, '../components');

// The sections every README has, in this order.
const SECTIONS = ['When to use', 'Usage', 'Props', 'Accessibility', 'Do and don\'t'];

// { Dir: [export names in index.js order] }, read from the import lines of
// components/index.js (`Theme` is the theming API, documented in docs/features/theming.md).
const exportsByDir = () => {
  const source = fs.readFileSync(path.join(componentsDir, 'index.js'), 'utf8');
  const dirs = {};
  const re = /^import\s+(.+?)\s+from\s+'\.\/([^/']+)[^']*';$/gm;
  let m;
  while ((m = re.exec(source))) {
    const [, clause, dir] = m;
    if (clause.startsWith('* as')) continue;
    const names = [];
    const named = clause.match(/\{([^}]*)\}/);
    const rest = clause.replace(/\{[^}]*\}/, '').replace(/,/g, '').trim();
    if (rest) names.push(rest);
    if (named) named[1].split(',').map(s => s.trim()).filter(Boolean).forEach(n => names.push(n));
    dirs[dir] = [...(dirs[dir] || []), ...names];
  }
  return dirs;
};

// Splits a README into `{ heading, body }` sections at its `##` headings.
const sectionsOf = text => {
  const out = [];
  let current = null;
  text.split('\n').forEach(line => {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) { current = { heading: h[1], body: [] }; out.push(current); } else if (current) current.body.push(line);
  });
  return out.map(s => ({ heading: s.heading, body: s.body.join('\n') }));
};

// The first column of a markdown table: the backticked names.
const propNames = body => body.split('\n')
  .filter(line => line.trim().startsWith('|'))
  .map(line => line.split('|')[1].trim())
  .filter(cell => /^`[^`]+`$/.test(cell))
  .map(cell => cell.slice(1, -1));

const codeBlocks = body => [...body.matchAll(/```(?:jsx|js|javascript)\n([\s\S]*?)```/g)].map(m => m[1]);

// All of a component directory's code, to look a prop name up in. A directory that only
// re-exports another's component (DateInput) is looked up in that one as well.
const sourceOf = (dir, seen = new Set()) => {
  seen.add(dir);
  const own = fs.readdirSync(path.join(componentsDir, dir))
    .filter(f => /\.jsx?$/.test(f))
    .map(f => fs.readFileSync(path.join(componentsDir, dir, f), 'utf8'))
    .join('\n');
  const reexported = [...own.matchAll(/export\s[^;]*\sfrom\s+'\.\.\/([^/']+)/g)]
    .map(m => m[1])
    .filter(other => !seen.has(other) && fs.existsSync(path.join(componentsDir, other)));
  return [own, ...reexported.map(other => sourceOf(other, seen))].join('\n');
};

const dirs = exportsByDir();

describe('component READMEs', () => {
  it('finds the components that index.js exports', () => {
    expect(Object.keys(dirs).length).toBeGreaterThan(80);
    Object.values(dirs).flat().forEach(name => expect(volta[name]).toBeDefined());
  });

  describe.each(Object.entries(dirs))('%s', (dir, names) => {
    const primary = names[0];
    const file = path.join(componentsDir, dir, 'README.md');
    const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    const sections = sectionsOf(text);

    it('has a README.md', () => {
      expect(fs.existsSync(file)).toBe(true);
    });

    it('is titled with the primary export and has a one-line purpose', () => {
      const [title, ...lines] = text.split('\n');
      expect(title).toMatch(new RegExp(`^# .*\\b${primary}\\b`));
      const purpose = lines.find(l => l.trim() !== '');
      expect(purpose).toBeTruthy();
      expect(purpose.startsWith('#')).toBe(false);
    });

    it('has the standard sections in order', () => {
      const present = sections.map(s => s.heading).filter(h => SECTIONS.includes(h));
      expect(present).toEqual(SECTIONS);
    });

    it('has a Usage example that parses and imports only exported names', () => {
      const usage = sections.find(s => s.heading === 'Usage');
      const blocks = usage ? codeBlocks(usage.body) : [];
      expect(blocks.length).toBeGreaterThan(0);
      blocks.forEach(code => {
        const ast = parse(code, { sourceType: 'module', plugins: ['jsx'] });
        ast.program.body
          .filter(node => node.type === 'ImportDeclaration' && node.source.value === 'volta')
          .forEach(node => node.specifiers.forEach(spec => {
            expect(volta[spec.imported ? spec.imported.name : 'default']).toBeDefined();
          }));
      });
    });

    it('links only to files that exist', () => {
      [...text.matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g)]
        .map(m => m[1])
        .filter(href => !/^[a-z]+:/.test(href))
        .forEach(href => expect(fs.existsSync(path.resolve(path.dirname(file), href))).toBe(true));
    });

    names.forEach((name, index) => {
      const Component = volta[name];
      const propTypes = Component && Component.propTypes;
      const samePropTypes = index > 0 && propTypes && propTypes === volta[primary].propTypes;
      if (index > 0) {
        it(`${name} is mentioned in a heading`, () => {
          expect(sections.some(s => s.heading.includes(name))).toBe(true);
        });
      }
      if (samePropTypes || (index > 0 && !propTypes)) return;

      it(`documents the props of ${name}`, () => {
        const section = sections.find(s => s.heading === (index === 0 ? 'Props' : `${name} props`));
        expect(section).toBeDefined();
        const listed = propNames(section.body);
        Object.keys(propTypes || {}).forEach(prop => expect(listed).toContain(prop));
        listed.filter(prop => /^\w+$/.test(prop)).forEach(prop => {
          expect(sourceOf(dir)).toMatch(new RegExp(`\\b${prop}\\b`));
        });
      });
    });
  });

  it('has no README for a directory that exports nothing', () => {
    const strays = fs.readdirSync(componentsDir)
      .filter(d => fs.existsSync(path.join(componentsDir, d, 'README.md')) && !dirs[d]);
    expect(strays).toEqual([]);
  });
});
