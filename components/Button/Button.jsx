import React from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

const Button = ({ onClick, children, className, variant, type, bsStyle, size, disabled, full, tiny, label, ...otherProps }) => {
  const displayLabel = label || children;
  const variantClass = variant || type || bsStyle || Button.variantTypes[0];

  let sz = size;
  if (tiny) sz = 'tiny';

  const buttonProps = {
    className: 'v-button button-' + variantClass +
      (className ? ' ' + className : '') +
      (sz ? ' button-' + sz : '') +
      (disabled ? ' button-disabled' : '') +
      (full ? ' button-full' : '')
    ,
    onClick,
    ...otherProps
  };

  return (
    <div {...buttonProps}>
      {displayLabel}
    </div>
  );
};

Button.variantTypes = ['default', 'primary', 'link', 'danger'];
Button.sizes = ['small', 'large', 'tiny'];

Button.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.oneOf(Button.variantTypes),
  // type: PropTypes.oneOf(Button.variantTypes),
  // bsStyle temporary react-bootstrap compatibility
  size: PropTypes.oneOf(Button.sizes),
  disabled: PropTypes.bool
};

export default Button;
