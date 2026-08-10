// Badge is an icon or character with a circle around it.

import PropTypes from 'prop-types';

import Icon from "../Icon";

import "./Badge.scss";

const Badge = ({ variant, size, style, ...otherProps }) => {

  const variantObj = Badge.variants[variant];
  if (!variantObj) return null;

  if (!size) size = Badge.sizes[1];

  const { color, icon } = variantObj;

  style || (style = {});
  style['color'] = color;

  return <Icon className={"v-badge badge-" + size} type={icon} style={style} {...otherProps} />
};

Badge.variants = {
  check: {
    color: '#3AA231',
    icon: 'checkmark.circle.fill'
  },
  bluecheck: {
    color: '#4A90E2',
    icon: 'checkmark.circle.fill'
  },
  x: {
    color: '#AF1E2D',
    icon: 'xmark.circle.fill'
  }
};

Badge.sizes = ['small', 'medium', 'large'];


Badge.propTypes = {
  variant: PropTypes.oneOf(Object.keys(Badge.variants)),
  size: PropTypes.oneOf(Badge.sizes)
};

export default Badge;
