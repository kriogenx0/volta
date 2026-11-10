import Icon from '../../components/Icon/Icon';
import { aliasesOf, iconNames } from '../../components/Icon/svgIcons';

import './Icon-examples.scss';

// Every icon the library draws, once each, with the other names that give the same one.
const IconGrid = () => (
  <div className="example-row example-row--roomy">
    {iconNames.map((name) => {
      const others = aliasesOf(name);
      return (
        <div key={name} className="example-icon_tile">
          <Icon type={name} />
          <span className="example-icon_tile-name">{name}</span>
          {others.length > 0 && <span className="example-icon_tile-name example-icon_tile-aliases">{others.join(', ')}</span>}
        </div>
      );
    })}
  </div>
);

export default {
  name: 'Icon',
  description: 'Icons by name, drawn as inline SVG: they need no font, take the text colour and size (1em), and the spinner turns. A name follows SF Symbols where there is one (chevron.down, xmark, trash), and the older names (close, multiply, check) draw the same icons. A filled icon (circle.fill, checkmark.circle.fill) cuts its glyph out in the page colour. The grid shows every icon.',
  examples: [
    {
      name: 'Every icon',
      code: `<Icon type="trash" />
<Icon type="spinner" />
<Icon type="cloud-upload" />
<Icon type="chevron.down" />
<Icon type="checkmark.circle.fill" />`,
      output: <IconGrid />
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
