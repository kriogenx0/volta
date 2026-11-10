import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { format as formatDate, startOfDay, endOfDay } from 'date-fns';

import { isDate } from '../../util/dateTimeUtils';
import Button from '../Button/Button';
import Dater from '../../util/Dater';

import './Calendar.scss';
import { map } from '../../util/collection';

const sameDay = (a, b) => Boolean(a && b)
  && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// One month at a time. `date` picks the month shown first and the highlighted
// day (no day is highlighted without one); minDate and maxDate, whole days
// inclusive, grey out the days outside them. Choosing a day calls
// onDateSelect with a Date for it.
const Calendar = ({ date, minDate, maxDate, onDateSelect }) => {
  const [dater, setDater] = useState(() => new Dater(isDate(date) ? date : null));
  const [selected, setSelected] = useState(() => (isDate(date) ? new Date(date.getTime()) : null));

  // Follow a new `date` from the parent, but not on the first render
  const startTime = isDate(date) ? date.getTime() : null;
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setDater(new Dater(startTime));
    setSelected(startTime === null ? null : new Date(startTime));
  }, [startTime]);

  const isOutOfRange = (candidate) => Boolean(
    (isDate(minDate) && candidate < startOfDay(minDate)) || (isDate(maxDate) && candidate > endOfDay(maxDate))
  );

  // Each move makes a new Dater (they mutate), so React sees it change
  const handlePreviousClick = () => setDater(dater.clone().previousMonth());
  const handleNextClick = () => setDater(dater.clone().nextMonth());
  const handleMonthClick = () => setDater(new Dater());

  const selectDay = (dayNumber) => {
    const nextDater = dater.clone().day(dayNumber);
    const selectedDate = nextDater.cloneDate();

    if (isOutOfRange(selectedDate)) return;

    setDater(nextDater);
    setSelected(selectedDate);

    if (onDateSelect) {
      onDateSelect(selectedDate);
    }
  };

  const renderCalendarMonth = () => {
    const days = [];

    const firstDayOfWeek = dater.clone().firstDayOfMonth().dayOfWeek();
    const daysInMonth = dater.daysInMonth();

    // POPULATE PREVIOUS DAYS
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ value: null });
    }

    // POPULATE MONTH DAYS
    for (let i = 1; i <= daysInMonth; i++) {
      const candidate = dater.clone().day(i).cloneDate();
      days.push({
        value: i,
        disabled: isOutOfRange(candidate),
        current: sameDay(candidate, selected),
        label: formatDate(candidate, 'MMMM d, yyyy')
      });
    }

    return map(days, (day, i) => {
      // Blank cells before the 1st only keep the weeks lined up
      if (!day.value) {
        return <div className="calendar-day day-blank" key={`blank-${i}`} aria-hidden="true" />;
      }

      return (
        <button
          type="button"
          className={`calendar-day ${day.disabled ? 'day-disabled' : 'day-active'}${day.current ? ' day-current' : ''}`}
          key={`day-${day.value}`}
          aria-label={day.label}
          aria-pressed={day.current}
          disabled={day.disabled}
          onClick={() => selectDay(day.value)}
        >
          {day.value}
        </button>
      );
    });
  };

  return (
    <div className='volta-date_picker_calendar'>
      <div>
        <Button className='cal-prev' size='small' aria-label='Previous month' onClick={handlePreviousClick}>
          &larr;
        </Button>
        <Button className='cal-next' size='small' aria-label='Next month' onClick={handleNextClick}>
          &rarr;
        </Button>
        <Button className='cal-month' variant='link' size='small' title='Show the current month' onClick={handleMonthClick}>
          {dater.monthName().substr(0, 3)} {String(dater.year()).substr(2)}
        </Button>
      </div>
      {renderCalendarMonth()}
      <div className='clear' />
    </div>
  );
};

Calendar.propTypes = {
  date: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func,
};

export default Calendar;
