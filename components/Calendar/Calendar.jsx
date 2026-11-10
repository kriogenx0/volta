import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button/Button';
import Dater from '../../util/Dater';

import './Calendar.scss';
import { map } from '../../util/collection';

// One month at a time. `date` picks the month shown first and the highlighted
// day (today when missing); it is read again whenever it changes to a different
// moment. Choosing a day calls onDateSelect with a Dater for it.
const Calendar = ({ date, onDateSelect }) => {
  // Each change makes a new Dater (they mutate), so React sees it change
  const [dater, setDater] = useState(() => new Dater(date || null));

  // Follow a new `date` from the parent, but not on the first render
  const startTime = date ? new Dater(date).date.getTime() : null;
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setDater(new Dater(date || null));
  }, [startTime]);

  const handlePreviousClick = () => setDater(dater.clone().previousMonth());
  const handleNextClick = () => setDater(dater.clone().nextMonth());
  const handleMonthClick = () => setDater(new Dater());

  const selectDay = (dayNumber) => {
    const newDater = dater.clone().day(dayNumber);
    setDater(newDater);

    if (onDateSelect) {
      onDateSelect(newDater);
    }
  };

  const renderCalendarMonth = () => {
    const days = [];
    const currentDay = dater.day();

    // POPULATE PREVIOUS DAYS
    for (let i = 0; i < dater.clone().firstDayOfMonth().dayOfWeek(); i++) {
      days.push({ value: null, active: false });
    }

    // POPULATE MONTH DAYS
    for (let i = 1; i <= dater.daysInMonth(); i++) {
      days.push({ value: i, active: true, current: currentDay === i });
    }

    return map(days, (day, i) => {
      // Blank cells before the 1st only keep the weeks lined up
      if (!day.active) {
        return <div className="calendar-day day-inactive" key={`blank-${i}`} aria-hidden="true" />;
      }

      return (
        <button
          type="button"
          className={`calendar-day day-active${day.current ? ' day-current' : ''}`}
          key={`day-${day.value}`}
          aria-label={`${dater.monthName()} ${day.value}, ${dater.year()}`}
          aria-current={day.current ? 'date' : undefined}
          onClick={() => selectDay(day.value)}
        >
          {day.value}
        </button>
      );
    });
  };

  return (
    <div className='volta-calendar'>
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
  // Month and day to show first. A Date, a Dater, a timestamp or a date string.
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(Dater),
    PropTypes.number,
    PropTypes.string
  ]),
  // Called with a Dater for the day that was chosen
  onDateSelect: PropTypes.func
};

export default Calendar;
