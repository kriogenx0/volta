import PropTypes from 'prop-types';

import { useFieldControl } from '../Field/fieldContext';

import "./Checkbox.scss";

// Inside a Field it takes the Field's id, hint and error as well.
const Checkbox = ({ label, disabled, ...props}) => {
  const inField = useFieldControl({ id: props.id, 'aria-describedby': props['aria-describedby'], 'aria-invalid': props['aria-invalid'] });
  return (
    <label className={`volta-checkbox${disabled ? ' checkbox-disabled' : ''}`} title={label}>
      <input
        type="checkbox"
        label={label}
        disabled={disabled}
        {...props}
        {...inField}
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
