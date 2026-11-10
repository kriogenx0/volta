import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import SegmentedControl from '../SegmentedControl/SegmentedControl';

import './TimePicker.scss';
import range from '../../util/range';

const MERIDIEM_OPTIONS = [
  { label: 'am', value: false },
  { label: 'pm', value: true }
];

const pad = (n) => String(n).padStart(2, '0');

// How long the dropdown waits after focus leaves before it closes, so a click on an
// hour or a minute still lands.
const CLOSE_DELAY = 200;

// "15:30", "3:30 pm" or { fullDate: '15:30' } -> { hour24, minute }, or null
const parseValue = (value) => {
  const text = value && typeof value === 'object' ? value.fullDate : value;
  if (typeof text !== 'string') return null;

  const [hourPart, minutePart] = text.split(':');
  let hour24 = parseInt(hourPart, 10);
  if (Number.isNaN(hour24)) return null;

  if (/pm/i.test(text) && hour24 < 12) hour24 += 12;
  if (/am/i.test(text) && hour24 === 12) hour24 = 0;

  return { hour24: hour24 % 24, minute: parseInt(minutePart, 10) || 0 };
};

// What the user may pick: 1-12 on a 12-hour clock, 0-23 on a 24-hour one
const hourRange = (twentyFourHour) => (twentyFourHour ? range(0, 24) : range(1, 13));
const isNumber = (text) => /^\d{1,2}$/.test(text);

// An hour field and a minute field (type a time, or step with the arrow keys), and,
// whenever either has focus, one dropdown with both lists to pick from.
const TimePicker = ({ value = null, twentyFourHour = false, minuteInterval = 15, onChange = () => {} }) => {
  const [hour, setHour] = useState(null);     // as displayed: 1-12, or 0-23 when twentyFourHour
  const [minute, setMinute] = useState(null); // 0-59
  const [pm, setPm] = useState(false);
  const [hourText, setHourText] = useState('');
  const [minuteText, setMinuteText] = useState('');
  const [open, setOpen] = useState(false);
  const closing = useRef(null);
  const popoverRef = useRef(null);

  // Don't let a pending close fire after the picker is gone
  useEffect(() => () => clearTimeout(closing.current), []);

  // Show a value passed in, including one that arrives after the first render
  useEffect(() => {
    const parsed = parseValue(value);
    if (!parsed) return;

    const shownHour = twentyFourHour ? parsed.hour24 : (parsed.hour24 % 12 || 12);
    setHour(shownHour);
    setMinute(parsed.minute);
    setPm(parsed.hour24 > 11);
    setHourText(String(shownHour));
    setMinuteText(pad(parsed.minute));
  }, [value, twentyFourHour]);

  const hours = hourRange(twentyFourHour);
  const minutes = range(0, 60, minuteInterval);

  // When the dropdown opens, bring the chosen hour and minute into view in their lists
  useEffect(() => {
    if (!open || !popoverRef.current) return;
    popoverRef.current.querySelectorAll('.time_picker-option--selected').forEach((option) => {
      const column = option.parentElement;
      column.scrollTop = option.offsetTop - (column.clientHeight / 2) + (option.clientHeight / 2);
    });
  }, [open]);

  const emit = (shownHour, shownMinute, isPm) => {
    if (shownHour === null) return; // nothing to report until an hour is picked

    const minuteValue = pad(shownMinute || 0);
    const hour24 = twentyFourHour ? shownHour : (shownHour % 12) + (isPm ? 12 : 0);
    const hour12 = hour24 % 12 || 12;

    onChange({
      hour: twentyFourHour ? hour24 : hour12,
      minute: minuteValue,
      pm: hour24 > 11,
      fullDate: `${hour24}:${minuteValue}`,
      formatted: twentyFourHour ? `${hour24}:${minuteValue}` : `${hour12}:${minuteValue} ${hour24 > 11 ? 'pm' : 'am'}`
    });
  };

  const handleHourChange = (text) => {
    setHourText(text);
    if (!isNumber(text)) return;

    const next = parseInt(text, 10);
    if (!hourRange(twentyFourHour).includes(next)) return;

    setHour(next);
    emit(next, minute, pm);
  };

  const handleMinuteChange = (text) => {
    setMinuteText(text);
    if (!isNumber(text)) return;

    const next = parseInt(text, 10);
    if (next > 59) return;

    setMinute(next);
    emit(hour, next, pm);
  };

  const handleMeridiemChange = (nextPm) => {
    setPm(nextPm);
    emit(hour, minute, nextPm);
  };

  // On blur, show the last good value rather than half-typed text
  const settleHour = () => setHourText(hour === null ? '' : String(hour));
  const settleMinute = () => setMinuteText(minute === null ? '' : pad(minute));

  // Choosing from the dropdown sets the field and its text at once
  const pickHour = (next) => {
    setHourText(String(next));
    setHour(next);
    emit(next, minute, pm);
  };

  const pickMinute = (next) => {
    setMinuteText(pad(next));
    setMinute(next);
    emit(hour, next, pm);
  };

  // The arrow keys step the field: an hour at a time, a minute interval at a time, wrapping
  const stepHour = (delta) => {
    const current = hour === null ? (delta > 0 ? hours[hours.length - 1] : hours[0]) : hour;
    const at = hours.indexOf(current);
    pickHour(hours[(at + delta + hours.length) % hours.length]);
  };

  const stepMinute = (delta) => {
    const current = minute === null ? 0 : minute;
    const stepped = (current + (delta * minuteInterval) + 60) % 60;
    pickMinute(stepped);
  };

  const handleKeyDown = (step) => (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      step(event.key === 'ArrowUp' ? 1 : -1);
      setOpen(true);
    }
  };

  // Opens while either field has focus; closes shortly after focus leaves the picker
  // (not when it just moves between the fields and the dropdown), or on Escape.
  const cancelClose = () => clearTimeout(closing.current);
  const openDropdown = () => {
    cancelClose();
    setOpen(true);
  };
  const scheduleClose = () => {
    closing.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  return (
    <div
      className='volta-time_picker'
      role='group'
      aria-label='Time'
      onFocus={cancelClose}
      onBlur={scheduleClose}
      onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}
    >
      <div className='time_picker-fields'>
        <input
          className='time_picker-input time_picker-hour'
          type='text'
          inputMode='numeric'
          aria-label='Hour'
          placeholder='hh'
          value={hourText}
          onFocus={openDropdown}
          onChange={(event) => handleHourChange(event.target.value)}
          onKeyDown={handleKeyDown(stepHour)}
          onBlur={settleHour}
        />
        <div className='time_picker-div'>:</div>
        <input
          className='time_picker-input time_picker-minute'
          type='text'
          inputMode='numeric'
          aria-label='Minute'
          placeholder='mm'
          value={minuteText}
          onFocus={openDropdown}
          onChange={(event) => handleMinuteChange(event.target.value)}
          onKeyDown={handleKeyDown(stepMinute)}
          onBlur={settleMinute}
        />
        {!twentyFourHour && (
          <SegmentedControl size='sm' ariaLabel='AM or PM' options={MERIDIEM_OPTIONS} value={pm} onChange={handleMeridiemChange} />
        )}
      </div>
      {open && (
        // Mousedown on the lists must not take focus from the field, or the dropdown would close before the click lands
        <div className='time_picker-dropdown' ref={popoverRef} onMouseDown={(event) => event.preventDefault()}>
          <div className='time_picker-column' role='group' aria-label='Hours'>
            {hours.map((option) => (
              <button
                key={option}
                type='button'
                tabIndex={-1}
                className={`time_picker-option${hour === option ? ' time_picker-option--selected' : ''}`}
                aria-pressed={hour === option}
                onClick={() => pickHour(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className='time_picker-column' role='group' aria-label='Minutes'>
            {minutes.map((option) => (
              <button
                key={option}
                type='button'
                tabIndex={-1}
                className={`time_picker-option${minute === option ? ' time_picker-option--selected' : ''}`}
                aria-pressed={minute === option}
                onClick={() => pickMinute(option)}
              >
                {pad(option)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

TimePicker.propTypes = {
  // "15:30", "3:30 pm", or the { fullDate } object onChange gives back
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ fullDate: PropTypes.string })]),
  twentyFourHour: PropTypes.bool,
  // Minutes offered in the dropdown (any 0-59 can still be typed)
  minuteInterval: PropTypes.number,
  // ({ hour, minute, pm, fullDate, formatted }) => void
  onChange: PropTypes.func
};

export default TimePicker;
