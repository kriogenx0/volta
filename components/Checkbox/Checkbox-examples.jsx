import Checkbox from './index.js';

export default {
  name: 'Checkbox',
  description: 'A beautifully styled checkbox that\'s consistent accross browsers.',
  examples: [
    {
      name: 'Unchecked',
      code: (
        '<Checkbox label="Check me" />'
      ),
      output: (
        <Checkbox label="Check me" />
      )
    },
    {
      name: 'Checked',
      code: (
        '<Checkbox label="Check me" checked />'
      ),
      output: (
        <Checkbox label="Check me" checked />
      )
    }
  ]
};
