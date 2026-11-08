import PropTypes from 'prop-types';

import { useFieldControl } from '../Field/fieldContext';

import './Toggle.scss';

// Inside a Field it takes the Field's id, hint and error (its label then names the switch).
export default function Toggle({ name, checked, onChange = () => {}, className, isDisabled = false, value, ...otherProps }) {
  const inField = useFieldControl({ id: otherProps.id, 'aria-describedby': otherProps['aria-describedby'], 'aria-invalid': otherProps['aria-invalid'] });
  const toggleClass = `volta-toggle ${className || ''} ${isDisabled ? 'toggle-disabled' : ''} ${checked ? 'toggle-checked' : ''}`;

  const inputProps = {
    name,
    value,
    checked,
    onChange,
    disabled: isDisabled,
    ...otherProps,
    ...inField
  };

  return (
    <label className={toggleClass}>
      <input type="checkbox" {...inputProps} />
      <span className="toggle-body">
        <span className="toggle-switch" />
        <span className="toggle-track">
          <span className="toggle-bg" />
          <span className="toggle-bg toggle-bg-negative" />
        </span>
      </span>
    </label>
  );
}

Toggle.propTypes = {
  name: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
  value: PropTypes.string,
  className: PropTypes.string,
};
