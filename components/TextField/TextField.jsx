import React, { useId } from 'react';
import PropTypes from 'prop-types';

import FieldLabel from '../FieldLabel/FieldLabel';

import './TextField.scss';

const TextField = ({ disabled, multiline, validate, error, label, optional, fieldSize = 'sm', className = '', wrapperClassName = '', id, ...inputProps }) => {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const handleKeyUp = validate ? (event) => validate(event.target.value) : inputProps.onKeyUp;
  const controlProps = { ...inputProps, id: label ? fieldId : id, disabled, onKeyUp: handleKeyUp, className: className || undefined };
  const control = multiline ? <textarea {...controlProps} /> : <input type={inputProps.type || 'text'} {...controlProps} />;

  const field = (
    <div className={`volta-textfield volta-textfield--${fieldSize}${wrapperClassName ? ` ${wrapperClassName}` : ''}${error ? ' textfield-error' : ''}${disabled ? ' textfield-disabled' : ''}${multiline ? ' textfield-multiline' : ''}`}>
      {control}
    </div>
  );

  if (!label) return field;
  return (
    <div>
      <FieldLabel htmlFor={fieldId} optional={optional}>{label}</FieldLabel>
      {field}
    </div>
  );
};

TextField.propTypes = {
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  validate: PropTypes.func,
  error: PropTypes.string,
  label: PropTypes.string,
  optional: PropTypes.bool,
  fieldSize: PropTypes.oneOf(['sm', 'md'])
};

// TextBox is retained as a compatibility name for TextField.
// ironyoung-compat: c-text_box is the class name its own view-level scss targets directly.
const TextBox = (props) => <TextField wrapperClassName="c-text_box" {...props} />;

export { TextField, TextBox };
export default TextField;
