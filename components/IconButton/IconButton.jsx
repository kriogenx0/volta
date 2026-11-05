import React from 'react';
import PropTypes from 'prop-types';

import './IconButton.scss';

const VARIANTS = ['ghost', 'danger'];

const IconButton = ({ icon: Icon, label, size = 16, variant = 'ghost', className = '', type = 'button', ...props }) => (
  <button type={type} aria-label={label} title={label} className={`volta-icon_button volta-icon_button--${variant} ${className}`.trim()} {...props}><Icon size={size} /></button>
);

IconButton.variants = VARIANTS;

IconButton.propTypes = {
  // A component, not an element: it is rendered as <Icon size={size} />.
  icon: PropTypes.elementType.isRequired,
  // Becomes the aria-label and the tooltip. The button shows only an icon, so it is required.
  label: PropTypes.string.isRequired,
  size: PropTypes.number,
  variant: PropTypes.oneOf(VARIANTS),
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export { IconButton };
export default IconButton;
