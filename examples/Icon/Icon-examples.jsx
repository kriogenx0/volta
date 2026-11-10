import Icon from '../../components/Icon/Icon';

import './Icon-examples.scss';

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

// Drawn as inline SVG: they need no font, so they show anywhere.
const DRAWN = ['trash', 'spinner', 'cloud-upload', 'check-circle', 'times-circle', 'arrow-up-circle'];

const DrawnIcons = () => (
  <div className="example-row example-row--roomy">
    {DRAWN.map(name => (
      <div key={name} className="example-icon_tile example-icon_tile--drawn">
        <Icon type={name} />
        <span className="example-icon_tile-name">{name}</span>
      </div>
    ))}
  </div>
);

const IconGrid = () => (
  <div className="example-row example-row--roomy">
    {iconNames.map(name => (
      <div key={name} className="example-icon_tile">
        <Icon type={name} />
        <span className="example-icon_tile-name">{name}</span>
      </div>
    ))}
  </div>
);

export default {
  name: 'Icon',
  description: 'Icons by name. The drawn icons (trash, spinner, cloud-upload, check-circle, times-circle, arrow-up-circle) are inline SVG: they need no font, take the text colour and size (1em), and the spinner turns. The others come from the "Volta Icons" font or SF Symbols, which this library does not load, so they show only where the host app provides those fonts (the grid below is mostly blank without them).',
  examples: [
    {
      name: 'Drawn icons (no font needed)',
      code: `<Icon type="trash" />
<Icon type="spinner" />
<Icon type="cloud-upload" />
<Icon type="check-circle" />
<Icon type="times-circle" />
<Icon type="arrow-up-circle" />`,
      output: <DrawnIcons />
    },
    {
      name: 'Colour and size follow the text',
      code: `<span style={{ color: 'green', fontSize: 32 }}><Icon type="check-circle" aria-hidden="true" /> Saved</span>
<span style={{ color: 'crimson', fontSize: 32 }}><Icon type="times-circle" aria-hidden="true" /> Failed</span>`,
      output: (
        <div className="example-row example-row--wide">
          <span className="example-icon_status example-icon_status--ok"><Icon type="check-circle" aria-hidden="true" /> Saved</span>
          <span className="example-icon_status example-icon_status--error"><Icon type="times-circle" aria-hidden="true" /> Failed</span>
        </div>
      )
    },
    {
      name: 'Icon grid (font icons)',
      code: '<Icon type="chevron.right" />',
      output: <IconGrid />
    },
    {
      name: 'Icon sizes',
      code: `<Icon type="star" size="small" />
<Icon type="star" />
<Icon type="star" size="large" />`,
      output: (
        <div className="example-row example-row--cozy">
          <Icon type="star" size="small" />
          <Icon type="star" />
          <Icon type="star" size="large" />
        </div>
      )
    },
  ]
};
