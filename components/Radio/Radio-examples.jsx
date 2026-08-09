import Radio from './Radio';

export default {
  name: 'Radio',
  description: 'A single radio button input.',
  examples: [
    {
      name: 'Radio button',
      code: '<Radio name="choice" title="Option A" value="a" />',
      output: <Radio name="choice" title="Option A" value="a" />
    },
    {
      name: 'Disabled radio',
      code: '<Radio name="choice" title="Unavailable option" disabled />',
      output: <Radio name="choice" title="Unavailable option" disabled />
    },
    {
      name: 'Radio group (manual)',
      code: `<div>
  <Radio name="plan" title="Free" value="free" defaultChecked />
  <Radio name="plan" title="Pro" value="pro" />
  <Radio name="plan" title="Enterprise" value="enterprise" />
</div>`,
      output: (
        <div>
          <Radio name="plan" title="Free" value="free" defaultChecked />
          <Radio name="plan" title="Pro" value="pro" />
          <Radio name="plan" title="Enterprise" value="enterprise" />
        </div>
      )
    },
  ]
};
