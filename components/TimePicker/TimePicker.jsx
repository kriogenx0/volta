import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import SegmentedControl from '../SegmentedControl/SegmentedControl';
import ComboBox from '../ComboBox/ComboBox';

import './TimePicker.scss';
import range from '../../util/range';

const MERIDIEM_OPTIONS = [
  { label: 'am', value: false },
  { label: 'pm', value: true }
];

const pad = (n) => String(n).padStart(2, '0');

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

const TimePicker = ({ value = null, twentyFourHour = false, minuteInterval = 15, onChange = () => {} }) => {
  const [hour, setHour] = useState(null);     // as displayed: 1-12, or 0-23 when twentyFourHour
  const [minute, setMinute] = useState(null); // 0-59
  const [pm, setPm] = useState(false);
  const [hourText, setHourText] = useState('');
  const [minuteText, setMinuteText] = useState('');

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

  const hourOptions = hourRange(twentyFourHour).map(String);
  const minuteOptions = range(0, 60, minuteInterval).map(pad);

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

  return (
    <div className='volta-time_picker' role='group' aria-label='Time'>
      <div className='time_picker-hour'>
        <ComboBox items={hourOptions} value={hourText} placeholder='hh' onChange={handleHourChange} onCommit={settleHour} />
      </div>
      <div className='time_picker-div'>:</div>
      <div className='time_picker-minute'>
        <ComboBox items={minuteOptions} value={minuteText} placeholder='mm' onChange={handleMinuteChange} onCommit={settleMinute} />
      </div>
      {!twentyFourHour && (
        <SegmentedControl size='sm' ariaLabel='AM or PM' options={MERIDIEM_OPTIONS} value={pm} onChange={handleMeridiemChange} />
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
