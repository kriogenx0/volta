import React from "react";
import PropTypes from "prop-types";

import "./TextField.scss";

const TextField = ({
  disabled,
  multiline,
  validate,
  error,
  ...inputProps
}) => {

  if (disabled) inputProps.disabled = disabled;

  if (validate) {
    const handleKeyUp = (e) => {
      validate(e.target.value);
    }
    inputProps.onKeyUp = handleKeyUp;
  }

  const className = 'v-textfield' + 
    (error ? ' textfield-error' : '') + 
    (disabled ? ' textfield-disabled' : '') +
    (multiline ? ' textfield-multiline' : '')
  ;

  return (
    <div className={className}>
      { multiline ?
        <textarea {...inputProps} />
        :
        <input type="text" {...inputProps} />
      }
    </div>
  );
};

TextField.propTypes = {
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  validate: PropTypes.func,
  error: PropTypes.string
};

export default TextField;