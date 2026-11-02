import PropTypes from 'prop-types';

import Icon from '../Icon';
import './Badge.scss';

const TONES = ['success', 'warning', 'danger', 'neutral', 'info'];

const Badge = ({ variant, size, style = {}, tone, children, ...otherProps }) => {
  if (children || tone) {
    const selectedTone = tone || 'neutral';
    return <span className={`volta-badge volta-badge--pill volta-badge--${selectedTone}`} {...otherProps}>{children}</span>;
  }

  const variantObj = Badge.variants[variant];
  if (!variantObj) return null;
  const selectedSize = size || Badge.sizes[1];
  return <Icon className={`volta-badge badge-${selectedSize}`} type={variantObj.icon} style={{ ...style, color: variantObj.color }} {...otherProps} />;
};

Badge.variants = {
  check: { color: '#3AA231', icon: 'checkmark.circle.fill' },
  bluecheck: { color: '#4A90E2', icon: 'checkmark.circle.fill' },
  x: { color: '#AF1E2D', icon: 'xmark.circle.fill' }
};
Badge.sizes = ['small', 'medium', 'large'];
Badge.tones = TONES;
Badge.propTypes = {
  variant: PropTypes.oneOf(Object.keys(Badge.variants)),
  size: PropTypes.oneOf(Badge.sizes),
  tone: PropTypes.oneOf(TONES)
};

export { Badge };
export default Badge;
