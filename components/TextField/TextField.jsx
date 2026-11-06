import React, { useId } from 'react';
import PropTypes from 'prop-types';

import ErrorText from '../ErrorText/ErrorText';
import FieldHint from '../FieldHint/FieldHint';
import FieldLabel from '../FieldLabel/FieldLabel';
import { useFieldControl } from '../Field/fieldContext';

import './TextField.scss';

// A label, hint and error of its own are linked to the input; inside a Field (or
// FieldRow) it takes that one's id, hint and error as well.
const TextField = ({ disabled, multiline, validate, error, hint, label, optional, fieldSize = 'sm', className = '', wrapperClassName = '', id, ...inputProps }) => {
  const generatedId = useId();
  const inField = useFieldControl({ id, 'aria-describedby': inputProps['aria-describedby'], 'aria-invalid': inputProps['aria-invalid'] });
  // The id the input gets: the caller's, the Field's, or one made here for its own label
  const controlId = inField.id || (label ? generatedId : undefined);
  const fieldId = controlId || generatedId;
  const handleKeyUp = validate ? (event) => validate(event.target.value) : inputProps.onKeyUp;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const describedBy = [inField['aria-describedby'], hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;
  const controlProps = {
    ...inputProps,
    id: controlId,
    disabled,
    onKeyUp: handleKeyUp,
    className: className || undefined,
    'aria-invalid': error ? true : inField['aria-invalid'],
    'aria-describedby': describedBy
  };
  const control = multiline ? <textarea {...controlProps} /> : <input type={inputProps.type || 'text'} {...controlProps} />;

  const field = (
    <div className={`volta-textfield volta-textfield--${fieldSize}${wrapperClassName ? ` ${wrapperClassName}` : ''}${error ? ' textfield-error' : ''}${disabled ? ' textfield-disabled' : ''}${multiline ? ' textfield-multiline' : ''}`}>
      {control}
    </div>
  );

  if (!label && !hint && !error) return field;
  return (
    <div>
      {label && <FieldLabel htmlFor={fieldId} optional={optional}>{label}</FieldLabel>}
      {field}
      {hint && <FieldHint id={hintId}>{hint}</FieldHint>}
      {error && <div id={errorId} className="volta-textfield-error_message"><ErrorText message={error} /></div>}
    </div>
  );
};

TextField.propTypes = {
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  validate: PropTypes.func,
  error: PropTypes.string,
  // Help text under the field, read with it by a screen reader
  hint: PropTypes.string,
  label: PropTypes.string,
  optional: PropTypes.bool,
  fieldSize: PropTypes.oneOf(['sm', 'md'])
};

// TextBox is retained as a compatibility name for TextField.
// ironyoung-compat: c-text_box is the class name its own view-level scss targets directly.
const TextBox = (props) => <TextField wrapperClassName="c-text_box" {...props} />;

export { TextField, TextBox };
export default TextField;
