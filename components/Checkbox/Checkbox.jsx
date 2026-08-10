import PropTypes from 'prop-types';

import "./Checkbox.scss";

const Checkbox = ({ label, disabled, ...props}) => {
  return (
    <label className={`v-checkbox${disabled ? ' checkbox-disabled' : ''}`} title={label}>
      <input
        type="checkbox"
        label={label}
        disabled={disabled}
        {...props}
      />
      <span>{label}</span>
    </label>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool
};

export default Checkbox;
