import Tag from './Tag';

export default {
  name: 'Tag',
  description: 'A compact label for categorizing or filtering content.',
  examples: [
    {
      name: 'Tag',
      code: '<Tag>Design</Tag>',
      output: <Tag>Design</Tag>
    },
    {
      name: 'Deletable tag',
      code: '<Tag deletable onDelete={() => {}}>React</Tag>',
      output: <Tag deletable>React</Tag>
    },
    {
      name: 'Clickable tag',
      code: '<Tag onClick={() => alert("clicked")}>Engineering</Tag>',
      output: <Tag onClick={() => {}}>Engineering</Tag>
    },
    {
      name: 'Tag group',
      code: `<div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
  <Tag>Frontend</Tag>
  <Tag>Backend</Tag>
  <Tag deletable>Design</Tag>
  <Tag deletable>Mobile</Tag>
</div>`,
      output: (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Tag>Frontend</Tag>
          <Tag>Backend</Tag>
          <Tag deletable>Design</Tag>
          <Tag deletable>Mobile</Tag>
        </div>
      )
    },
  ]
};
