import React from 'react';

import './IconButton.scss';

const VARIANTS = ['ghost', 'danger'];

const IconButton = ({ icon: Icon, label, size = 16, variant = 'ghost', className = '', type = 'button', ...props }) => (
  <button type={type} aria-label={label} title={label} className={`volta-icon_button volta-icon_button--${variant} ${className}`.trim()} {...props}><Icon size={size} /></button>
);

IconButton.variants = VARIANTS;

export { IconButton };
export default IconButton;
