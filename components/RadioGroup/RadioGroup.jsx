import PropTypes from 'prop-types';
import _ from 'lodash';

import './RadioGroup.scss';

const RadioGroup = ({ options, value, onChange, name, className }) => {
  const handleSelect = (e) => {
    if (onChange) onChange(e);
  };

  // A radio's value is always a string in the change event, so a number or
  // boolean option value would never match what the parent stored from it.
  const isSelected = (optionValue) => value != null && String(optionValue) === String(value);

  return (
    <div className={`volta-radiogroup${className ? ' ' + className : ''}`}>
      {_.map(options, (option, i) => (
        <label key={i} className='radiogroup-option'>
          <input type='radio' name={name} value={option.value} onChange={handleSelect} checked={isSelected(option.value)} />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

RadioGroup.propTypes = {
  value: PropTypes.any,
  name: PropTypes.any.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any
  })),
  className: PropTypes.string,
  onChange: PropTypes.func
};

export default RadioGroup;
