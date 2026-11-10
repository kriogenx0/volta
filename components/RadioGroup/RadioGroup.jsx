import PropTypes from 'prop-types';

import Radio from '../Radio/Radio';

import './RadioGroup.scss';
import { map } from '../../util/collection';

// A set of Radio buttons built from an options array; one of them can be chosen.
const RadioGroup = ({ options, value, onChange, name, className }) => {
  const handleSelect = (e) => {
    if (onChange) onChange(e);
  };

  // A radio's value is always a string in the change event, so a number or
  // boolean option value would never match what the parent stored from it.
  const isSelected = (optionValue) => value != null && String(optionValue) === String(value);

  return (
    <div className={`volta-radiogroup${className ? ' ' + className : ''}`}>
      {map(options, (option, i) => (
        <Radio
          key={i}
          title={option.label}
          name={name}
          value={option.value}
          disabled={option.disabled}
          onChange={handleSelect}
          checked={isSelected(option.value)}
        />
      ))}
    </div>
  );
};

RadioGroup.propTypes = {
  value: PropTypes.any,
  name: PropTypes.any.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
    // This option can't be chosen
    disabled: PropTypes.bool
  })),
  className: PropTypes.string,
  onChange: PropTypes.func
};

export default RadioGroup;
