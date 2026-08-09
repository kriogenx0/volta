import Badge from './index.js';

export default {
  name: 'Badge',
  description: 'Text or icons wrapped in a rounded box.',
  examples: [
    {
      name: 'X',
      code: (
        '<Badge variant="x" />'
      ),
      output: (
        <Badge variant="x" />
      )
    },
    {
      name: 'Check',
      code: (
        '<Badge variant="check" />'
      ),
      output: (
        <Badge variant="check" />
      )
    }
  ]
};
