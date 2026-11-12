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

// "15:30", "15:30:45", "3:30 pm" or { fullDate: '15:30' } -> { hour24, minute, second }, or null
const parseValue = (value) => {
  const text = value && typeof value === 'object' ? value.fullDate : value;
  if (typeof text !== 'string') return null;

  const [hourPart, minutePart, secondPart] = text.split(':');
  let hour24 = parseInt(hourPart, 10);
  if (Number.isNaN(hour24)) return null;

  if (/pm/i.test(text) && hour24 < 12) hour24 += 12;
  if (/am/i.test(text) && hour24 === 12) hour24 = 0;

  return { hour24: hour24 % 24, minute: parseInt(minutePart, 10) || 0, second: parseInt(secondPart, 10) || 0 };
};

// What the user may pick: 1-12 on a 12-hour clock, 0-23 on a 24-hour one
const hourRange = (twentyFourHour) => (twentyFourHour ? range(0, 24) : range(1, 13));
const isNumber = (text) => /^\d{1,2}$/.test(text);

// The two parts that run from 0 to 59, with how each is labelled
const SIXTY = {
  minute: { label: 'Minute', placeholder: 'mm', list: 'Minutes' },
  second: { label: 'Second', placeholder: 'ss', list: 'Seconds' }
};

// An hour field and a minute field (and a second field with `seconds`): type a time, or
// step with the arrow keys, and, whenever one has focus, one dropdown with a list for
// each to pick from. 12-hour with am or pm by default, 24-hour with `twentyFourHour`.
const TimePicker = ({
  value = null, twentyFourHour = false, seconds = false, minuteInterval = 15, secondInterval = 15, onChange = () => {}
}) => {
  // As displayed: the hour is 1-12 (0-23 when twentyFourHour); minute and second are 0-59
  const [parts, setParts] = useState({ hour: null, minute: null, second: null });
  const [texts, setTexts] = useState({ hour: '', minute: '', second: '' });
  const [pm, setPm] = useState(false);
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  // Show a value passed in, including one that arrives after the first render
  useEffect(() => {
    const parsed = parseValue(value);
    if (!parsed) return;

    const shownHour = twentyFourHour ? parsed.hour24 : (parsed.hour24 % 12 || 12);
    setParts({ hour: shownHour, minute: parsed.minute, second: parsed.second });
    setTexts({ hour: String(shownHour), minute: pad(parsed.minute), second: pad(parsed.second) });
    setPm(parsed.hour24 > 11);
  }, [value, twentyFourHour]);

  const hours = hourRange(twentyFourHour);
  const lists = {
    minute: range(0, 60, minuteInterval),
    second: range(0, 60, secondInterval)
  };
  const intervals = { minute: minuteInterval, second: secondInterval };

  // When the dropdown opens, bring the chosen entries into view in their lists
  useEffect(() => {
    if (!open || !popoverRef.current) return;
    popoverRef.current.querySelectorAll('.time_picker-option--selected').forEach((option) => {
      const column = option.parentElement;
      column.scrollTop = option.offsetTop - (column.clientHeight / 2) + (option.clientHeight / 2);
    });
  }, [open]);

  const emit = (next, isPm) => {
    if (next.hour === null) return; // nothing to report until an hour is picked

    const minuteValue = pad(next.minute || 0);
    const secondValue = pad(next.second || 0);
    const hour24 = twentyFourHour ? next.hour : (next.hour % 12) + (isPm ? 12 : 0);
    const hour12 = hour24 % 12 || 12;
    const clock = `${minuteValue}${seconds ? `:${secondValue}` : ''}`;

    onChange({
      hour: twentyFourHour ? hour24 : hour12,
      minute: minuteValue,
      ...(seconds ? { second: secondValue } : {}),
      pm: hour24 > 11,
      fullDate: `${hour24}:${clock}`,
      formatted: twentyFourHour ? `${hour24}:${clock}` : `${hour12}:${clock} ${hour24 > 11 ? 'pm' : 'am'}`
    });
  };

  // Choosing from the dropdown, or a valid typed entry, sets the part and reports the time
  const setPart = (name, number, text) => {
    const next = { ...parts, [name]: number };
    setParts(next);
    setTexts((current) => ({ ...current, [name]: text }));
    emit(next, pm);
  };

  const handleChange = (name) => (text) => {
    setTexts((current) => ({ ...current, [name]: text }));
    if (!isNumber(text)) return;

    const number = parseInt(text, 10);
    const valid = name === 'hour' ? hourRange(twentyFourHour).includes(number) : number <= 59;
    if (!valid) return;

    const next = { ...parts, [name]: number };
    setParts(next);
    emit(next, pm);
  };

  const handleMeridiemChange = (nextPm) => {
    setPm(nextPm);
    emit(parts, nextPm);
  };

  // On blur, show the last good value rather than half-typed text
  const settle = (name) => () => setTexts((current) => ({
    ...current,
    [name]: parts[name] === null ? '' : (name === 'hour' ? String(parts[name]) : pad(parts[name]))
  }));

  const pickHour = (number) => setPart('hour', number, String(number));
  const pickSixty = (name) => (number) => setPart(name, number, pad(number));

  // The arrow keys step the field: an hour at a time, an interval at a time, wrapping
  const stepHour = (delta) => {
    const current = parts.hour === null ? (delta > 0 ? hours[hours.length - 1] : hours[0]) : parts.hour;
    const at = hours.indexOf(current);
    pickHour(hours[(at + delta + hours.length) % hours.length]);
  };

  const stepSixty = (name) => (delta) => {
    const current = parts[name] === null ? 0 : parts[name];
    pickSixty(name)((current + (delta * intervals[name]) + 60) % 60);
  };

  const handleKeyDown = (step) => (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      step(event.key === 'ArrowUp' ? 1 : -1);
      setOpen(true);
    }
  };

  // Opens while a field has focus and closes the moment focus leaves the picker, or on
  // Escape. Moving between the fields keeps it open (focus stays inside), and pressing
  // an entry in a list never takes focus from the field, so no wait is needed.
  const openDropdown = () => setOpen(true);
  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  };

  const sixties = seconds ? ['minute', 'second'] : ['minute'];

  return (
    <div
      className='volta-time_picker'
      role='group'
      aria-label='Time'
      onBlur={handleBlur}
      onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}
    >
      <div className='time_picker-fields'>
        <div className='time_picker-boxes'>
          <input
            className='time_picker-input time_picker-hour'
            type='text'
            inputMode='numeric'
            aria-label='Hour'
            placeholder='hh'
            value={texts.hour}
            onFocus={openDropdown}
            onChange={(event) => handleChange('hour')(event.target.value)}
            onKeyDown={handleKeyDown(stepHour)}
            onBlur={settle('hour')}
          />
          {sixties.map((name) => (
            <input
              key={name}
              className={`time_picker-input time_picker-${name}`}
              type='text'
              inputMode='numeric'
              aria-label={SIXTY[name].label}
              placeholder={SIXTY[name].placeholder}
              value={texts[name]}
              onFocus={openDropdown}
              onChange={(event) => handleChange(name)(event.target.value)}
              onKeyDown={handleKeyDown(stepSixty(name))}
              onBlur={settle(name)}
            />
          ))}
        {open && (
          // Mousedown on the lists must not take focus from the field, or the dropdown would close before the click lands
          <div className='time_picker-dropdown' ref={popoverRef} onMouseDown={(event) => event.preventDefault()}>
            <div className='time_picker-column' role='group' aria-label='Hours'>
              {hours.map((option) => (
                <button
                  key={option}
                  type='button'
                  tabIndex={-1}
                  className={`time_picker-option${parts.hour === option ? ' time_picker-option--selected' : ''}`}
                  aria-pressed={parts.hour === option}
                  onClick={() => pickHour(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            {sixties.map((name) => (
              <div className='time_picker-column' role='group' aria-label={SIXTY[name].list} key={name}>
                {lists[name].map((option) => (
                  <button
                    key={option}
                    type='button'
                    tabIndex={-1}
                    className={`time_picker-option${parts[name] === option ? ' time_picker-option--selected' : ''}`}
                    aria-pressed={parts[name] === option}
                    onClick={() => pickSixty(name)(option)}
                  >
                    {pad(option)}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
        </div>
        {!twentyFourHour && (
          <SegmentedControl size='sm' ariaLabel='AM or PM' options={MERIDIEM_OPTIONS} value={pm} onChange={handleMeridiemChange} />
        )}
      </div>
    </div>
  );
};

TimePicker.propTypes = {
  // "15:30", "3:30 pm", or the { fullDate } object onChange gives back
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ fullDate: PropTypes.string })]),
  // Hours 0-23 and no am or pm switch (off by default)
  twentyFourHour: PropTypes.bool,
  // Add a seconds field and list (off by default)
  seconds: PropTypes.bool,
  // Minutes offered in the dropdown (any 0-59 can still be typed)
  minuteInterval: PropTypes.number,
  // Seconds offered in the dropdown (any 0-59 can still be typed)
  secondInterval: PropTypes.number,
  // ({ hour, minute, second (with seconds), pm, fullDate, formatted }) => void
  onChange: PropTypes.func
};

export default TimePicker;
