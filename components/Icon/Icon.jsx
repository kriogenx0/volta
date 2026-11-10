import PropTypes from 'prop-types';

import icons, { unicodeIcons } from './icons';
import svgIcons from './svgIcons';
import './Icon.scss';

// An icon is drawn one of three ways, found by `type`: inline SVG (svgIcons.js,
// needs no font), a glyph from the "Volta Icons" font (icons.js), or an SF
// Symbols character (unicodeIcons). SVG is tried first and covers the icons the
// library and its examples use; the other two only show where those fonts are
// available, which the library doesn't load.
const Icon = ({ type, className, size, ...otherProps }) => {

  const paths = svgIcons[type];

  let icon;
  let useUnicode = false;
  if (!paths) {
    if (icons[type]) {
      icon = icons[type];
    } else if (unicodeIcons[type]) {
      useUnicode = true;
      icon = unicodeIcons[type];
    }

    if (!icon) console.warn("Icon type not recognized. type: " + type)
  }

  let clsName = 'volta-icon icon' +
    (useUnicode ? ' icon-unicode sf-symbol' : '') +
    (paths ? ' icon-svg' : '') +
    (className ? ' ' + className : '') +
    (type && !useUnicode ? ` icon-${type}` : '') +
    (size ? ` icon-${size}` : '')
  ;

  let iProps = {
    className: clsName,
    "data-type": type,
    ...otherProps,
  };

  if (paths) {
    iProps.children = (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        {paths.map((shape) => {
          if (typeof shape === 'string') return <path key={shape} d={shape} />;
          // A solid shape, or a stroke in the page colour cut out of one
          if (shape.fill) return <path key={shape.d} d={shape.d} className="icon-fill" fill="currentColor" stroke="none" />;
          return <path key={shape.d} d={shape.d} className="icon-knockout" />;
        })}
      </svg>
    );
  } else if (useUnicode) {
    iProps.children = icon;
  } else {
    iProps.style = {
      content: icon
    };
  }

  return (
    <i {...iProps} />
  );
};

Icon.sizes = ['small'];

Icon.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOfType([
    PropTypes.oneOf(Object.keys(svgIcons)),
    PropTypes.oneOf(Object.keys(icons)),
    PropTypes.oneOf(Object.keys(unicodeIcons))
  ]).isRequired,
  size: PropTypes.oneOf(Icon.sizes)
};

export default Icon;
