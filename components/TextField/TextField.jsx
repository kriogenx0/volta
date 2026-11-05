import React, { useId } from 'react';
import PropTypes from 'prop-types';

import ErrorText from '../ErrorText/ErrorText';
import FieldLabel from '../FieldLabel/FieldLabel';

import './TextField.scss';

const TextField = ({ disabled, multiline, validate, error, label, optional, fieldSize = 'sm', className = '', wrapperClassName = '', id, ...inputProps }) => {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const handleKeyUp = validate ? (event) => validate(event.target.value) : inputProps.onKeyUp;
  const errorId = `${fieldId}-error`;
  const describedBy = [inputProps['aria-describedby'], error && errorId].filter(Boolean).join(' ') || undefined;
  const controlProps = {
    ...inputProps,
    id: label ? fieldId : id,
    disabled,
    onKeyUp: handleKeyUp,
    className: className || undefined,
    'aria-invalid': error ? true : inputProps['aria-invalid'],
    'aria-describedby': describedBy
  };
  const control = multiline ? <textarea {...controlProps} /> : <input type={inputProps.type || 'text'} {...controlProps} />;

  const field = (
    <div className={`volta-textfield volta-textfield--${fieldSize}${wrapperClassName ? ` ${wrapperClassName}` : ''}${error ? ' textfield-error' : ''}${disabled ? ' textfield-disabled' : ''}${multiline ? ' textfield-multiline' : ''}`}>
      {control}
    </div>
  );

  if (!label && !error) return field;
  return (
    <div>
      {label && <FieldLabel htmlFor={fieldId} optional={optional}>{label}</FieldLabel>}
      {field}
      {error && <div id={errorId} className="volta-textfield-error_message"><ErrorText message={error} /></div>}
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
