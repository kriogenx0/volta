import PropTypes from 'prop-types';

import icons, { unicodeIcons } from './icons';
import './Icon.scss';

const Icon = ({ type, className, size, ...otherProps }) => {

  let icon;
  let useUnicode = false;
  if (icons[type]) {
    icon = icons[type];
  } else if (unicodeIcons[type]) {
    useUnicode = true;
    icon = unicodeIcons[type];
  }

  if (!icon) console.warn("Soda Icon type not recognized. type: " + type)

  let clsName = 'soda-icon icon' +
    (useUnicode ? ' icon-unicode sf-symbol' : '') +
    (className ? ' ' + className : '') +
    (type && !useUnicode ? ` icon-${type}` : '') +
    (size ? ` icon-${size}` : '')
  ;

  let iProps = {
    className: clsName,
    "data-type": type,
    ...otherProps,
  };

  if (useUnicode) {
    iProps.children = icon;
  } else {
    iProps.style = {
      content: icon
    };
  };

  return (
    <i {...iProps} />
  );
};

Icon.sizes = ['small'];

Icon.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOfType([
    PropTypes.oneOf(Object.keys(icons)),
    PropTypes.oneOf(Object.keys(unicodeIcons))
  ]).isRequired,
  size: PropTypes.oneOf(Icon.sizes)
};

export default Icon;
