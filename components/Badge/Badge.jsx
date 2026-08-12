import PropTypes from 'prop-types';

import Icon from '../Icon';
import './Badge.scss';

const TONE_CLASS = {
  success: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  warning: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  info: 'bg-lavender/10 text-lavender'
};

const Badge = ({ variant, size, style = {}, tone, children, ...otherProps }) => {
  if (children || tone) {
    const selectedTone = tone || 'neutral';
    return <span className={`volta-badge rounded-full px-2 py-0.5 text-xs font-semibold ${TONE_CLASS[selectedTone]}`} {...otherProps}>{children}</span>;
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
Badge.propTypes = {
  variant: PropTypes.oneOf(Object.keys(Badge.variants)),
  size: PropTypes.oneOf(Badge.sizes),
  tone: PropTypes.oneOf(Object.keys(TONE_CLASS))
};

export { Badge };
export default Badge;
