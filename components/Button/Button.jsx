import React from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

const MODERN_VARIANTS = {
  primary: 'bg-gradient-to-br from-lilac to-lavender font-semibold text-white',
  secondary: 'border border-gray-300 font-medium dark:border-gray-700',
  ghost: '',
  danger: 'bg-red-600 font-semibold text-white hover:bg-red-700'
};

const MODERN_SIZES = {
  sm: 'rounded-md px-3 py-1.5 text-sm',
  md: 'rounded-lg px-4 py-2.5'
};

const Button = ({ onClick, children, className = '', variant, type = 'button', bsStyle, size, disabled, full, tiny, label, ...otherProps }) => {
  const displayLabel = label || children;
  const legacyType = Button.variantTypes.includes(type) ? type : null;
  const variantClass = variant || legacyType || bsStyle || Button.variantTypes[0];
  const modernVariant = MODERN_VARIANTS[variant];
  const modernSize = MODERN_SIZES[size];

  let legacySize = size;
  if (tiny) legacySize = 'tiny';

  const classes = [
    // ironyoung-compat: its Rails asset pipeline (backend/app/assets/stylesheets/ui/styles.scss)
    // still owns the actual button look via a plain `.btn` class; callers there pass variant/size
    // as literal className strings (e.g. `className='btn-primary'`), not through volta's variant/size
    // props, so this is the only addition needed for full visual parity.
    'btn',
    'volta-button',
    `button-${variantClass}`,
    legacySize && `button-${legacySize}`,
    disabled && 'button-disabled',
    full && 'button-full',
    modernVariant && 'inline-flex items-center justify-center gap-1.5 transition-colors disabled:cursor-default disabled:opacity-50',
    modernVariant,
    modernSize,
    variant === 'primary' && size === 'md' && 'shadow',
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
Button.sizes = ['small', 'large', 'tiny', 'sm', 'md'];

Button.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.oneOf([...Button.variantTypes, 'secondary', 'ghost']),
  size: PropTypes.oneOf(Button.sizes),
  disabled: PropTypes.bool
};

export { Button };
export default Button;
