import PropTypes from 'prop-types';

import "./Radio.scss";

const Radio = ({ title, disabled, ...props}) => {
  return (
    <label className={`v-radio${disabled ? ' radio-disabled' : ''}`} title={title}>
      <input
        type="radio"
        label={title}
        disabled={disabled}
        {...props}
      />
      <span>{title}</span>
    </label>
  );
};

Radio.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool
};

export default Radio;
