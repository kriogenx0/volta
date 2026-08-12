import PropTypes from 'prop-types';
import { format as formatDate } from 'date-fns';

import { toQaId } from '../../util/formats';
import { dateFormat, isDate } from '../../util/dateTimeUtils';
import Readonly from './Readonly';
import TextInput from '../TextField/TextField';

import './DateInput.scss';

const nativeDateFormat = 'yyyy-MM-dd';

const toNativeValue = (value) => (isDate(value) ? formatDate(value, nativeDateFormat) : '');

// Parse a native yyyy-MM-dd value in local time. Using new Date(value) would
// interpret it as UTC and can shift the selected day in western time zones.
const fromNativeValue = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return isDate(date) ? date : null;
};

const DateInput = ({
  'data-qa-id': parentQaId,
  disabled,
  format = dateFormat,
  maxDate,
  minDate,
  onChange,
  readonly,
  required,
  value,
  ...inputProps
}) => {
  const qaId = toQaId({ parentId: parentQaId, componentId: 'DateInput' });

  if (readonly) {
    return (
      <Readonly data-qa-id={qaId} className="volta-date_input">
        {isDate(value) ? formatDate(value, format) : ''}
      </Readonly>
    );
  }

  return (
    <TextInput
      {...inputProps}
      className="volta-date_input"
      type="date"
      data-qa-id={qaId}
      disabled={disabled}
      required={required}
      min={toNativeValue(minDate)}
      max={toNativeValue(maxDate)}
      value={toNativeValue(value)}
      onChange={(event) => onChange?.(fromNativeValue(event.target.value))}
    />
  );
};

DateInput.propTypes = {
  'data-qa-id': PropTypes.string,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  maxDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.instanceOf(Date),
};

export default DateInput;
