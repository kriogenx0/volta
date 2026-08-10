import React from 'react';

const VARIANT_CLASS = {
  ghost: 'text-gray-400 hover:text-gray-900 dark:hover:text-white',
  danger: 'text-gray-400 hover:text-red-600 dark:hover:text-red-400'
};

const IconButton = ({ icon: Icon, label, size = 16, variant = 'ghost', className = '', type = 'button', ...props }) => (
  <button type={type} aria-label={label} title={label} className={`shrink-0 ${VARIANT_CLASS[variant]} ${className}`.trim()} {...props}><Icon size={size} /></button>
);

export { IconButton };
export default IconButton;
