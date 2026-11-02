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
