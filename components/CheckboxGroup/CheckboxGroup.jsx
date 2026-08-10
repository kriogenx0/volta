import PropTypes from 'prop-types';
import _ from 'lodash';

import Checkbox from '../Checkbox';

const CheckboxGroup = ({ name, options, value, onChange, className, ...otherProps }) => {
  const handleChange = (e) => {
    onChange(e);
  };

  return (
    <div className={`ui-checkboxgroup${className ? ' ' + className : ''}`}>
      {_.map(options, (option, i) => (
        <Checkbox key={i}
          name={name}
          label={option.label}
          value={option.value}
          onChange={handleChange}
          checked={_.includes(value, option.value)}
          {...otherProps}
        />
      ))}
    </div>
  );
};

CheckboxGroup.propTypes = {
  value: PropTypes.array,
  name: PropTypes.any.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any
  })),
  onChange: PropTypes.func
};

export default CheckboxGroup;
