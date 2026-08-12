// Basic select input. Pass a list of options as the `options` prop, either
// an array of strings/numbers or an array of { label, value } objects.
//
// <SelectInput options={[{ value: 1, label: 'First' }, { value: 2, label: 'Second' }]} />
import { useState } from 'react';
import PropTypes from 'prop-types';

const SelectInput = ({ options, initialText, defaultValue, onChange, value: valueProp }) => {
  const [value, setValue] = useState(valueProp);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <select onChange={handleChange} defaultValue={defaultValue} value={value} className="volta-search txt inp inp-select l-full-width">
      {initialText && <option value="" key={0}>{initialText}</option>}
      {options && options.map((option, index) => (
        <option value={option.value || option} key={index + 1}>{option.label || option}</option>
      ))}
    </select>
  );
};

SelectInput.propTypes = {
  options: PropTypes.array,
  initialText: PropTypes.string,
  onChange: PropTypes.func
};

SelectInput.defaultProps = {
  options: null,
  initialText: null,
  onChange: () => {}
};

export default SelectInput;
