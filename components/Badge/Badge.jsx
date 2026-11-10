import PropTypes from 'prop-types';

import Icon from '../Icon';
import './Badge.scss';

const TONES = ['success', 'warning', 'danger', 'neutral', 'info'];

// A text badge (children, with a tone), or an icon badge (variant: a drawn check or cross).
const Badge = ({ variant, size, tone, children, ...otherProps }) => {
  if (children || tone) {
    const selectedTone = tone || 'neutral';
    return <span className={`volta-badge volta-badge--pill volta-badge--${selectedTone}`} {...otherProps}>{children}</span>;
  }

  const variantObj = Badge.variants[variant];
  if (!variantObj) return null;
  const selectedSize = size || Badge.sizes[1];
  return <Icon className={`volta-badge badge-${selectedSize} badge-${variant}`} type={variantObj.icon} {...otherProps} />;
};

// The colour of each is in Badge.scss, from the theme tokens (success, accent, danger).
Badge.variants = {
  check: { icon: 'checkmark.circle.fill' },
  bluecheck: { icon: 'checkmark.circle.fill' },
  x: { icon: 'xmark.circle.fill' }
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
