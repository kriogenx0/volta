import PropTypes from 'prop-types';

import './RadioGroup.scss';

const RadioGroup = ({ options, value, onChange, name, className }) => {
  const handleSelect = (e) => {
    onChange(e);
  };

  return (
    <div className={`ui-radiogroup ${className || ''}`}>
      {_.map(options, (option, i) => (
        <label key={i} className='radiogroup-option'>
          <input type='radio' name={name} value={option.value} onChange={handleSelect} checked={option.value === value} />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

RadioGroup.propTypes = {
  value: PropTypes.any,
  name: PropTypes.any.isRequired,
  options: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any
  }),
  onChange: PropTypes.func
};

export default RadioGroup;
