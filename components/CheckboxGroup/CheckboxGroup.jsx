import PropTypes from 'prop-types';

import Checkbox from '../Checkbox';

import './CheckboxGroup.scss';
import { map } from '../../util/collection';

const CheckboxGroup = ({ name, options, value, onChange, className, ...otherProps }) => {
  const handleChange = (e) => {
    if (onChange) onChange(e);
  };

  return (
    <div className={`volta-checkboxgroup${className ? ' ' + className : ''}`}>
      {map(options, (option, i) => (
        <Checkbox key={i}
          name={name}
          label={option.label}
          value={option.value}
          onChange={handleChange}
          checked={(value || []).includes(option.value)}
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
