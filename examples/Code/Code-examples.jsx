import Code from '../../components/Code/Code';

export default {
  name: 'Code',
  description: 'Syntax-highlighted code blocks, or a compact inline variant for short snippets.',
  examples: [
    {
      name: 'Code block',
      code: `<Code language="jsx">{'<Button variant="primary">Save</Button>'}</Code>`,
      output: <Code language="jsx">{'<Button variant="primary">Save</Button>'}</Code>
    },
    {
      name: 'Light theme',
      code: `<Code language="jsx" theme="light">{'<Button variant="primary">Save</Button>'}</Code>`,
      output: <Code language="jsx" theme="light">{'<Button variant="primary">Save</Button>'}</Code>
    },
    {
      name: 'Inline',
      code: `<p>Run <Code inline>npm install volta</Code> to get started.</p>`,
      output: <p>Run <Code inline>npm install volta</Code> to get started.</p>
    }
  ]
};
