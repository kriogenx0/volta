const fs = require('fs');
const path = require('path');

// moment and lodash stay out of new code; date-fns and luxon (already dependencies)
// and the platform cover what they do. The files that use moment today are listed
// below so they can be removed one at a time; lodash has no users left.
//
// A ratchet: a new file that imports either fails the test, and so does a listed
// file that no longer does, so each cleanup shrinks the list. See
// docs/features/dependencies.md.

const ROOT = path.join(__dirname, '..');

const sourceFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return ['node_modules', 'compiled', 'dist'].includes(entry.name) ? [] : sourceFiles(full);
  return /\.jsx?$/.test(entry.name) ? [full] : [];
});

// `from 'x'`, `import 'x'` (a side-effect import), `require('x')` and `import('x')`
const MOMENT = /(?:from|import|require\(|import\()\s*['"]moment(?:\/[^'"]*)?['"]/;
const LODASH = /(?:from|import|require\(|import\()\s*['"]lodash(?:-es)?(?:\/[^'"]*)?['"]/;

const importsOf = (text, pattern) => text.split('\n').some((line) => !/^\s*(\/\/|\*)/.test(line) && pattern.test(line));

const MOMENT_FILES = [
  'components/DatePicker/DateFormat.js' // public: DateFormat takes moment format strings
];

// lodash is gone; this stays empty so it can't come back. The helpers that took its place
// (map and each for arrays and objects, range, debounce, isEqual) are in util/.
const LODASH_FILES = [];

const using = (pattern) => ['components', 'util', 'styleguide', 'examples']
  .flatMap((dir) => sourceFiles(path.join(ROOT, dir)))
  .filter((file) => importsOf(fs.readFileSync(file, 'utf8'), pattern))
  .map((file) => path.relative(ROOT, file))
  .sort();

describe.each([
  ['moment', MOMENT, MOMENT_FILES],
  ['lodash', LODASH, LODASH_FILES]
])('%s', (name, pattern, allowed) => {
  const found = using(pattern);

  it('is not imported by any file that is not already on the list', () => {
    expect(found.filter((file) => !allowed.includes(file))).toEqual([]);
  });

  it('is still imported by every file on the list, so the list shrinks as they are cleaned up', () => {
    expect(allowed.filter((file) => !found.includes(file))).toEqual([]);
  });

  it('has its list in order, without repeats', () => {
    expect([...new Set(allowed)]).toEqual([...allowed].sort());
  });
});

describe('the check itself', () => {
  it('recognises every way of importing them', () => {
    ["import moment from 'moment';", 'import moment from "moment";', "const moment = require('moment');", "import 'moment/locale/fr';"]
      .forEach((line) => expect(importsOf(line, MOMENT)).toBe(true));
    ["import _ from 'lodash';", "import { map } from \"lodash\";", "import map from 'lodash/map';", "import { map } from 'lodash-es';", "const _ = require('lodash');"]
      .forEach((line) => expect(importsOf(line, LODASH)).toBe(true));
  });

  it('ignores the platform, date-fns, luxon, a comment, and a name that only starts the same', () => {
    ["import { format } from 'date-fns';", "import { DateTime } from 'luxon';", "// import _ from 'lodash';", "import x from 'momentum';", "import y from 'lodash.debounce-polyfill';"]
      .forEach((line) => {
        expect(importsOf(line, MOMENT)).toBe(false);
        expect(importsOf(line, LODASH)).toBe(false);
      });
  });
});
