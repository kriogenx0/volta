import { useState } from 'react';
import PropTypes from 'prop-types';
import { format as formatDate } from 'date-fns';

import { toQaId } from '../../util/formats';
import { dateFormat, isDate } from '../../util/dateTimeUtils';
import Dropdown from '../Dropdown';
import Readonly from './Readonly';
import TextBox from '../TextBox/TextBox';
import CalendarMini from './CalendarMini';

import './DatePicker.scss';

const DatePicker = ({
  'data-qa-id': parentQaId,
  className = '',
  defaultValue = null,
  disabled,
  format = dateFormat,
  maxDate,
  minDate,
  onChange,
  readonly,
  required,
  value: controlledValue,
  ...inputProps
}) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue === undefined ? internalValue : controlledValue;
  const qaId = toQaId({ parentId: parentQaId, componentId: 'DatePicker' });
  const displayValue = isDate(value) ? formatDate(value, format) : '';

  if (readonly) {
    return (
      <Readonly data-qa-id={qaId} className={`volta-date_input ${className}`.trim()}>
        {displayValue}
      </Readonly>
    );
  }

  const selectDate = (date) => {
    if (controlledValue === undefined) setInternalValue(date);
    onChange?.(date);
    setOpen(false);
  };

  const input = (
    <TextBox
      {...inputProps}
      className="volta-date_input"
      data-qa-id={qaId}
      disabled={disabled}
      required={required}
      readOnly
      value={displayValue}
      onClick={() => !disabled && setOpen(true)}
      onFocus={() => !disabled && setOpen(true)}
      aria-haspopup="dialog"
      aria-expanded={open}
    />
  );

  return (
    // ironyoung-compat: c-date_picker is the class name its own view-level scss targets directly.
    <Dropdown
      buttonComponent={input}
      className={`volta-date_picker c-date_picker ${className}`.trim()}
      open={open}
      onClose={() => setOpen(false)}
      showOverlay={open}
    >
      {/* A click inside doesn't close the dropdown; only choosing a date does
          (selectDate), so paging through months keeps the calendar open. */}
      <CalendarMini
        date={value}
        minDate={minDate}
        maxDate={maxDate}
        onDateSelect={selectDate}
      />
    </Dropdown>
  );
};

DatePicker.propTypes = {
  'data-qa-id': PropTypes.string,
  className: PropTypes.string,
  defaultValue: PropTypes.instanceOf(Date),
  disabled: PropTypes.bool,
  format: PropTypes.string,
  maxDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.instanceOf(Date),
};

// DateInput is another name for DatePicker, kept for existing callers.
const DateInput = DatePicker;

export { DatePicker, DateInput };
export default DatePicker;
