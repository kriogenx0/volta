import React, { useId } from 'react';
import PropTypes from 'prop-types';

import ErrorText from '../ErrorText/ErrorText';
import FieldHint from '../FieldHint/FieldHint';
import FieldLabel from '../FieldLabel/FieldLabel';
import { useFieldControl } from '../Field/fieldContext';

import './Select.scss';

// A label, hint and error of its own are linked to the select; inside a Field (or
// FieldRow) it takes that one's id, hint and error as well.
const Select = ({ options, value, onChange, className = '', label, hint, error, optional, fieldSize = 'sm', id, children, ...otherProps }) => {
  const generatedId = useId();
  const inField = useFieldControl({ id, 'aria-describedby': otherProps['aria-describedby'], 'aria-invalid': otherProps['aria-invalid'] });
  const controlId = inField.id || (label ? generatedId : undefined);
  const fieldId = controlId || generatedId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const describedBy = [inField['aria-describedby'], hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;
  const control = (
    <select
      value={value}
      onChange={onChange}
      className={className || undefined}
      {...otherProps}
      id={controlId}
      aria-invalid={error ? true : inField['aria-invalid']}
      aria-describedby={describedBy}
    >
      {children || (options || []).map((option, index) => <option key={index} value={option.value}>{option.label}</option>)}
    </select>
  );

  const wrapped = <div className={`volta-select volta-select--${fieldSize}${error ? ' select-error' : ''}`}>{control}</div>;
  if (!label && !hint && !error) return wrapped;
  return (
    <div>
      {label && <FieldLabel htmlFor={fieldId} optional={optional}>{label}</FieldLabel>}
      {wrapped}
      {hint && <FieldHint id={hintId}>{hint}</FieldHint>}
      {error && <div id={errorId} className="volta-select-error_message"><ErrorText message={error} /></div>}
    </div>
  );
};

Select.propTypes = {
  value: PropTypes.any,
  name: PropTypes.any,
  options: PropTypes.array,
  onChange: PropTypes.func,
  label: PropTypes.string,
  // Help text under the select, read with it by a screen reader
  hint: PropTypes.string,
  // An error message under the select; marks it invalid
  error: PropTypes.string,
  optional: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.node,
  fieldSize: PropTypes.oneOf(['sm', 'md'])
};

export { Select };
export default Select;
