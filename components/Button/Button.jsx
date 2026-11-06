import React from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

// Each deprecated way of using Button warns once, saying what to use instead. Not
// gated on NODE_ENV: the library build leaves `process.env.NODE_ENV` in place, and
// `process` doesn't exist in a browser.
const warned = new Set();

const deprecated = (key, message) => {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`Button: ${message}`);
};

// Old ways of choosing the look, still honoured but deprecated: `bsStyle` (a
// Bootstrap name), `tiny` (use size="tiny") and `type` set to a variant name (type
// is the HTML button type: button, submit or reset). Use `variant` and `size`.
const Button = ({ onClick, children, className = '', variant, type = 'button', bsStyle, size, disabled, full, tiny, label, ...otherProps }) => {
  const displayLabel = label || children;
  const legacyType = Button.variantTypes.includes(type) ? type : null;
  const variantClass = variant || legacyType || bsStyle || Button.variantTypes[0];

  if (bsStyle) deprecated(`bsStyle:${bsStyle}`, `the bsStyle prop is deprecated; use variant${Button.variantTypes.includes(bsStyle) ? `="${bsStyle}"` : ''}.`);
  if (legacyType) deprecated(`type:${legacyType}`, `type="${legacyType}" picks the look and is deprecated; use variant="${legacyType}" (type is the HTML button type: button, submit or reset).`);
  if (tiny) deprecated('tiny', 'the tiny prop is deprecated; use size="tiny".');

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

// Forget which deprecations have been reported, so each warns again (for tests).
Button.resetDeprecationWarnings = () => warned.clear();

Button.variantTypes = ['default', 'primary', 'link', 'danger'];
Button.sizes = ['small', 'large', 'tiny'];

Button.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.oneOf(Button.variantTypes),
  size: PropTypes.oneOf(Button.sizes),
  disabled: PropTypes.bool,
  // Deprecated: use `size="tiny"`
  tiny: PropTypes.bool,
  // Deprecated: use `variant`
  bsStyle: PropTypes.string
};

export { Button };
export default Button;
