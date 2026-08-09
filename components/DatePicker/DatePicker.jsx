import { useState } from 'react';

import TextBox from '../TextBox';

import Calendar from './Calendar';

const DatePickerDialog = (props) => {
  if (!props || !props.open) return null;

  return (
    <div className='c-date_picker_dialog'>
      <Calendar {...props} />
    </div>
  );
};

const DatePicker = () => {
  const [state, setState] = useState({
    open: false,
    date: null,
    dateValue: null
  });

  const handleFocus = () => {
    setState((prev) => ({ ...prev, open: true }));
  };

  const handleBlur = () => {
    // setState((prev) => ({ ...prev, open: false }));
  };

  const onDateSelect = (date) => {
    setState({
      open: false,
      date,
      dateValue: date.mdy()
    });
  };

  return (
    <div className='c-date_picker'>
      <TextBox
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={state.dateValue}
      />
      <DatePickerDialog
        open={state.open}
        date={state.date}
        onDateSelect={onDateSelect}
      />
    </div>
  );
};

DatePicker.defaultProps = {
  selectDateRange: false,
  dateFormat: null,
  timeFormat: null
};

export default DatePicker;
