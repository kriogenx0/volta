// Formsy-wrapped date/time range input. NOT wired into this library's
// index.js: it depends on 'formsy-react', which isn't a dependency here,
// and wraps DateTimeInput.jsx (itself not wired in either -- see that
// file's header comment). Kept for reference/future rewrite.
import PropTypes from 'prop-types';
import { withFormsy } from 'formsy-react';

import DateTimeInput from './DateTimeInput';

const noop = () => {};

const DateTimeRange = ({
  minDate = null, maxDate = null, align = null, placeholder = '', showDate = true, showTime = true,
  defaultValue = null, value, setValue, onChange = noop
}) => {
  const handleChange = (newValue) => {
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <DateTimeInput
      minDate={minDate}
      maxDate={maxDate}
      value={value}
      onChange={handleChange}
      showDate={showDate}
      showTime={showTime}
      placeholder={placeholder}
      defaultValue={defaultValue}
      align={align}
    />
  );
};

DateTimeRange.propTypes = {
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  align: PropTypes.string,
  placeholder: PropTypes.string,
  showDate: PropTypes.bool,
  showTime: PropTypes.bool,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func
};

export default withFormsy(DateTimeRange);
