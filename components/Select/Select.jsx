import PropTypes from 'prop-types';
import _ from 'lodash';

import './Select.scss';

const Select = ({ options, value, onChange, className, ...otherProps }) => {
  const selectProps = {
    value,
    onChange,
    ...otherProps
  };

  return (
    <div className={`v-select ${className || ''}`}>
      <select {...selectProps}>
        {_.map(options, (option, i) => (
          <option key={i} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

Select.propTypes = {
  value: PropTypes.string,
  name: PropTypes.any.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.any
  })),
  onChange: PropTypes.func
};

export default Select;
