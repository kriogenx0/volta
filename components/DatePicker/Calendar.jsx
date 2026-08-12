import { useState, useEffect } from 'react';
import _ from 'lodash';

import Dater from './Dater';

import './Calendar.scss';

const Calendar = ({ date, onDateSelect }) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePreviousClick = () => loadDater(dater.previousMonth());
  const handleNextClick = () => loadDater(dater.nextMonth());
  const handleMonthClick = () => loadDater(dater.now());

  const selectDay = (dayNumber) => {
    const newDater = dater.day(dayNumber);
    loadDater(newDater);

    if (onDateSelect) {
      onDateSelect(newDater);
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
      days.push({
        value: i,
        active: true,
        current: currentDay === i
      });
    }

    return _.map(days, (day, i) => {
      let dayClassName = `calendar-day ${day.active ? 'day-active' : 'day-inactive'}${day.current ? ' day-current' : ''}`;
      return (
        <div className={dayClassName} key={i} onClick={( () => { return selectDay(day.value); } )}>
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

export default Calendar;
