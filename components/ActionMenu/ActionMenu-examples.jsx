import ActionMenu from './index.js';

export default {
  name: 'ActionMenu',
  description: 'A menu for quick actions.',
  examples: [
    {
      name: 'ActionMenu',
      code: (
        '<ActionMenu items={[{ label: "First Item" }, { label: "Second Item" }]} onSelect={(i, k) => console.log(i, k)} />'
      ),
      output: (
        <ActionMenu items={[{ label: "First Item" }, { label: "Second Item" }]} onSelect={(i, k) => console.log(i, k)}/>
      )
    }
  ]
};
