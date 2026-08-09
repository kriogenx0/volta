import Icon from './Icon';

const iconNames = [
  'chevron.right', 'chevron.left', 'chevron.down', 'chevron.up',
  'xmark', 'plus', 'minus', 'checkmark',
  'magnifyingglass', 'trash', 'pencil', 'square.and.pencil',
  'doc', 'folder', 'gear', 'bell',
  'person', 'person.crop.circle', 'envelope', 'phone',
  'star', 'heart', 'bookmark', 'flag',
  'arrow.right', 'arrow.left', 'arrow.up', 'arrow.down',
  'circle.fill', 'checkmark.circle.fill', 'xmark.circle.fill', 'exclamationmark.circle.fill',
];

const IconGrid = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
    {iconNames.map(name => (
      <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 80 }}>
        <Icon type={name} />
        <span style={{ fontSize: 10, textAlign: 'center', wordBreak: 'break-all', color: '#666' }}>{name}</span>
      </div>
    ))}
  </div>
);

export default {
  name: 'Icon',
  description: 'SF Symbols icons via the @apple/sf-symbols-web package.',
  examples: [
    {
      name: 'Icon grid',
      code: '<Icon type="chevron.right" />',
      output: <IconGrid />
    },
    {
      name: 'Icon sizes',
      code: `<Icon type="star" size="small" />
<Icon type="star" />
<Icon type="star" size="large" />`,
      output: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon type="star" size="small" />
          <Icon type="star" />
          <Icon type="star" size="large" />
        </div>
      )
    },
  ]
};
