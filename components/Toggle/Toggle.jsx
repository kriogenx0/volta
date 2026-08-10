import PropTypes from 'prop-types';

import './Toggle.scss';

export default function Toggle({ name, checked, onChange, className, isDisabled, value, ...otherProps }) {
  const toggleClass = `v-toggle ${className || ''} ${isDisabled ? 'toggle-disabled' : ''} ${checked ? 'toggle-checked' : ''}`;

  const inputProps = {
    name,
    value,
    checked,
    onChange,
    ...otherProps
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
};

Toggle.defaultProps = {
  onChange: () => {},
  isDisabled: false,
};
