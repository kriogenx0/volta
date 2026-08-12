import React, { useId } from 'react';
import PropTypes from 'prop-types';

import './Select.scss';

const SIZE_CLASS = { sm: 'rounded-md px-2.5 py-1.5 text-sm', md: 'rounded-lg px-3 py-2' };

const Select = ({ options, value, onChange, className = '', label, optional, fieldSize = 'sm', id, children, ...otherProps }) => {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const control = (
    <select
      id={label ? fieldId : id}
      value={value}
      onChange={onChange}
      className={`w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 ${SIZE_CLASS[fieldSize]} ${className}`.trim()}
      {...otherProps}
    >
      {children || (options || []).map((option, index) => <option key={index} value={option.value}>{option.label}</option>)}
    </select>
  );

  const wrapped = <div className="volta-select">{control}</div>;
  if (!label) return wrapped;
  return (
    <div>
      <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}{optional && <span className="font-normal text-gray-400"> (optional)</span>}
      </label>
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
