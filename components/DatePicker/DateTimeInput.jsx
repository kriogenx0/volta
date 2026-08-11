// Date/time text input backed by the xdsoft jQuery datetimepicker plugin
// (https://github.com/xdan/datetimepicker). NOT wired into this library's
// index.js: it depends on 'jquery' and the datetimepicker plugin itself,
// neither of which are dependencies here (jQuery was removed from this
// repo entirely -- see README "Known gaps"). Kept for reference/future
// rewrite; DatePicker/DatePicker.jsx is the maintained,
// working date picker in this library.
import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import 'jquery-datetimepicker';
import moment from 'moment';

const DateTimeInput = ({
  name, showDate, showTime, value, defaultValue, onChange, onClose,
  minDate, maxDate, placeholder, isInline, align, inputClass
}) => {
  const dateWrapRef = useRef(null);
  const inputRef = useRef(null);
  const dbValueRef = useRef(value || defaultValue);

  const momentDisplayFormat = () => {
    if (showDate && showTime) return 'M/D/YY @ h:mmA';
    if (showDate) return 'M/D/YY';
    if (showTime) return 'h:mmA';
    return undefined;
  };

  const pluginDisplayFormat = () => {
    if (showDate && showTime) return 'n/j/y @ h:iA';
    if (showDate) return 'n/j/y';
    if (showTime) return 'h:iA';
    return undefined;
  };

  const setInputValue = () => {
    const inputNode = inputRef.current;
    inputNode.value = dbValueRef.current && moment(dbValueRef.current).isValid()
      ? moment(dbValueRef.current).format(momentDisplayFormat())
      : '';
  };

  useEffect(() => {
    const inputNode = inputRef.current;
    setInputValue();

    let picker = null;

    const minDateParsed = minDate && moment(minDate).isValid() ? moment(minDate).startOf('day').toDate() : undefined;
    const maxDateParsed = maxDate && moment(maxDate).isValid() ? moment(maxDate).endOf('day').toDate() : undefined;
    const defaultValueParsed = defaultValue && moment(defaultValue).isValid() && !inputNode.value
      ? moment(defaultValue).format('YYYY/MM/DD')
      : null;

    $(inputNode).datetimepicker({
      step: 30,
      inline: isInline,
      i18n: { en: { dayOfWeek: ['SU', 'M', 'T', 'W', 'TH', 'F', 'SA'] } },
      parentID: dateWrapRef.current,
      formatTime: 'g:i A',
      format: pluginDisplayFormat(),
      datepicker: showDate,
      timepicker: showTime,
      closeOnDateSelect: !showTime,
      minDate: minDateParsed,
      minTime: '12:00 AM',
      maxDate: maxDateParsed,
      maxTime: '11:59 PM',
      value: inputNode.value,
      startDate: defaultValueParsed || undefined,
      defaultSelect: false,
      scrollMonth: false,

      onGenerate() {
        picker = this;
        if (!isInline) picker.addClass('ddn');
        picker.find('.xdsoft_select').addClass('ddn');
        if ((!value || !inputRef.current.value) && defaultValueParsed) {
          picker.find('.xdsoft_current').removeClass('xdsoft_current');
        }
      },

      onShow(currentTime) {
        const currentMinutes = moment(currentTime).minutes();
        if (currentMinutes !== 0 && currentMinutes !== 30) {
          picker.find('.xdsoft_time_variant').addClass('is-imperfect');
        } else {
          picker.find('.xdsoft_time_variant').removeClass('is-imperfect');
        }

        picker.addClass('is-visible');
        picker.find('.xdsoft_select').addClass('is-visible');

        if (!dbValueRef.current) {
          picker.find('.xdsoft_calendar').addClass('is-off-month');
        }

        const options = {};
        if (inputNode.value) options.value = inputNode.value;
        picker.setOptions(options);
      },

      onClose() {
        picker.removeClass('is-visible');
        picker.find('.xdsoft_select').removeClass('is-visible');
        if (onClose) onClose(dbValueRef.current);
      },

      onChangeDateTime(currentTime) {
        dbValueRef.current = currentTime ? moment(currentTime).toISOString() : null;
        if (onChange) onChange(dbValueRef.current);
      },

      // Wait until the plugin moves the .xdsoft_current class so there isn't a jump from the previous date.
      onSelectDate() {
        setTimeout(() => picker.find('.xdsoft_calendar').removeClass('is-off-month'), 1);
      },

      onChangeMonth(currentTime) {
        const calendar = picker.find('.xdsoft_calendar');
        if (moment(currentTime).month() === moment(dbValueRef.current).month()) {
          calendar.removeClass('is-off-month');
        } else {
          calendar.addClass('is-off-month');
        }
      }
    });

    return () => {
      $(inputNode).datetimepicker('destroy');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDate, showTime, value, minDate]);

  return (
    <span>
      <div
        ref={dateWrapRef}
        className={`dte ${align ? `is-${align}` : ''} ${showDate ? 'date-enabled' : ''} ${showTime ? 'time-enabled' : ''}`}
      >
        <input ref={inputRef} className={`txt ${inputClass || ''}`} placeholder={placeholder} />
        <input type="hidden" name={name} value={dbValueRef.current || ''} readOnly />
      </div>
    </span>
  );
};

DateTimeInput.propTypes = {
  name: PropTypes.string,
  showDate: PropTypes.bool,
  showTime: PropTypes.bool,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  placeholder: PropTypes.string,
  isInline: PropTypes.bool,
  align: PropTypes.string,
  inputClass: PropTypes.string
};

DateTimeInput.defaultProps = {
  name: null,
  showDate: true,
  showTime: true,
  value: null,
  defaultValue: null,
  minDate: null,
  maxDate: null,
  placeholder: '',
  isInline: false,
  align: 'left',
  inputClass: null
};

export default DateTimeInput;
