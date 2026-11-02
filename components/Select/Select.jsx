import React, { useId } from 'react';
import PropTypes from 'prop-types';

import FieldLabel from '../FieldLabel/FieldLabel';

import './Select.scss';

const Select = ({ options, value, onChange, className = '', label, optional, fieldSize = 'sm', id, children, ...otherProps }) => {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const control = (
    <select
      id={label ? fieldId : id}
      value={value}
      onChange={onChange}
      className={className || undefined}
      {...otherProps}
    >
      {children || (options || []).map((option, index) => <option key={index} value={option.value}>{option.label}</option>)}
    </select>
  );

  const wrapped = <div className={`volta-select volta-select--${fieldSize}`}>{control}</div>;
  if (!label) return wrapped;
  return (
    <div>
      <FieldLabel htmlFor={fieldId} optional={optional}>{label}</FieldLabel>
      {wrapped}
    </div>
  );
};

Select.propTypes = {
  value: PropTypes.any,
  name: PropTypes.any,
  options: PropTypes.array,
  onChange: PropTypes.func,
  fieldSize: PropTypes.oneOf(['sm', 'md'])
};

export { Select };
export default Select;
