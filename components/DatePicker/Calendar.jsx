import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Dater from './Dater';

import './Calendar.scss';

const Calendar = ({ date, minDate, maxDate, onDateSelect }) => {
  const [dater, setDater] = useState(null);
  const [currentDay, setCurrentDay] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);

  const loadDater = (nextDater) => {
    if (nextDater) {
      setDater(nextDater);
      setCurrentDay(nextDater.day());
      setCurrentMonth((nextDater.monthName() + '').substr(0, 3));
      setCurrentYear((nextDater.year() + '').substr(2));
    }
  };

  useEffect(() => {
    loadDater(new Dater(date || null));
  }, [date]);

  const handlePreviousClick = () => loadDater(dater.previousMonth());
  const handleNextClick = () => loadDater(dater.nextMonth());
  const handleMonthClick = () => loadDater(dater.now());

  const selectDay = (dayNumber) => {
    if (!dayNumber) return;
    const newDater = dater.day(dayNumber);
    const selectedDate = newDater.cloneDate();

    if ((minDate && selectedDate < minDate) || (maxDate && selectedDate > maxDate)) return;

    loadDater(newDater);

    if (onDateSelect) {
      onDateSelect(selectedDate);
    }
  };

  const renderCalendarMonth = () => {
    if (!dater) return null;

    const days = [];

    let firstDayOfWeek = dater.clone().firstDayOfMonth().dayOfWeek();
    let daysInMonth = dater.daysInMonth();

    // POPULATE PREVIOUS DAYS
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        value: null,
        active: false
      });
    }

    // POPULATE MONTH DAYS
    for (let i = 1; i <= daysInMonth; i++) {
      const candidate = dater.clone().day(i).cloneDate();
      const disabled = (minDate && candidate < minDate) || (maxDate && candidate > maxDate);
      days.push({
        value: i,
        active: !disabled,
        current: currentDay === i
      });
    }

    return _.map(days, (day, i) => {
      let dayClassName = `calendar-day ${day.active ? 'day-active' : 'day-inactive'}${day.current ? ' day-current' : ''}`;
      return (
        <div className={dayClassName} key={i} onClick={() => day.active && selectDay(day.value)}>
          {day.value}
        </div>
      );
    });
  };

  return (
    <div className='volta-date_picker_calendar'>
      <div>
        <div className='btn cal-prev' onClick={handlePreviousClick}>
          &larr;
        </div>
        <div className='btn cal-next' onClick={handleNextClick}>
          &rarr;
        </div>
        <div className='btn cal-month' onClick={handleMonthClick}>
          {currentMonth} {currentYear}
        </div>
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
