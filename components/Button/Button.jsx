import React from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

const Button = ({ onClick, children, className = '', variant, type = 'button', bsStyle, size, disabled, full, tiny, label, ...otherProps }) => {
  const displayLabel = label || children;
  const legacyType = Button.variantTypes.includes(type) ? type : null;
  const variantClass = variant || legacyType || bsStyle || Button.variantTypes[0];

  let legacySize = size;
  if (tiny) legacySize = 'tiny';

  const classes = [
    'v-button',
    `button-${variantClass}`,
    legacySize && `button-${legacySize}`,
    disabled && 'button-disabled',
    full && 'button-full',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={legacyType ? 'button' : type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...otherProps}
    >
      {displayLabel}
    </button>
  );
};

Button.variantTypes = ['default', 'primary', 'link', 'danger'];
Button.sizes = ['small', 'large', 'tiny'];

Button.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.oneOf(Button.variantTypes),
  size: PropTypes.oneOf(Button.sizes),
  disabled: PropTypes.bool
};

export { Button };
export default Button;
