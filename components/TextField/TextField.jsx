import React, { useId } from 'react';
import PropTypes from 'prop-types';

import './TextField.scss';

const SIZE_CLASS = {
  sm: 'rounded-md px-2.5 py-1.5 text-sm',
  md: 'rounded-lg px-3 py-2'
};

const TextField = ({ disabled, multiline, validate, error, label, optional, fieldSize = 'sm', className = '', id, ...inputProps }) => {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const handleKeyUp = validate ? (event) => validate(event.target.value) : inputProps.onKeyUp;
  const controlClassName = `w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 ${SIZE_CLASS[fieldSize]} ${className}`.trim();
  const controlProps = { ...inputProps, id: label ? fieldId : id, disabled, onKeyUp: handleKeyUp, className: controlClassName };
  const control = multiline ? <textarea {...controlProps} /> : <input type={inputProps.type || 'text'} {...controlProps} />;

  const field = (
    <div className={`v-textfield${error ? ' textfield-error' : ''}${disabled ? ' textfield-disabled' : ''}${multiline ? ' textfield-multiline' : ''}`}>
      {control}
    </div>
  );

  if (!label) return field;
  return (
    <div>
      <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}{optional && <span className="font-normal text-gray-400"> (optional)</span>}
      </label>
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

export { TextField };
export default TextField;
