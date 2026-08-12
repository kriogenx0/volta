import { useState, useEffect, useRef } from 'react';
import _ from 'lodash';

import SegmentedControl from '../SegmentedControl/SegmentedControl';
import ComboBox from '../ComboBox/ComboBox';

import './TimePicker.scss';

const generateTimes = (minuteInterval) => {
  const hours = _.times(12, n => String(n + 1));

  const minutes = [];
  let time = 0;
  while (time < 60) {
    minutes.push(time ? String(time) : '00');
    time += minuteInterval;
  }

  return { hours, minutes };
};

const TimePicker = ({ value, twentyFourHour, minuteInterval, onChange }) => {
  const [hourState, setHourState] = useState(0);
  const [minuteState, setMinuteState] = useState(0);
  const [pmState, setPmState] = useState(false);

  const hour = useRef(0);
  const minute = useRef(0);
  const pm = useRef(false);

  const { hours, minutes } = generateTimes(minuteInterval);

  const fullDate = () => {
    const h = parseInt(hour.current);
    const hourVal = (pm.current ? (h + 12) : h) % 24;
    return hourVal + ':' + minute.current;
  };

  const exportValue = () => {
    let h = hour.current;
    let pmSuffix;
    if (!twentyFourHour) {
      h = parseInt(h) % 12;
      if (!h) h = 12;
      pmSuffix = ' ' + (pm.current || hour.current > 11 ? 'pm' : 'am');
    } else {
      pmSuffix = '';
    }
    return h + ':' + minute.current + pmSuffix;
  };

  const updateState = () => {
    setHourState(hour.current);
    setMinuteState(minute.current);
    setPmState(pm.current);
  };

  const loadValue = (val) => {
    if (val === null) return;

    if (typeof(val) === 'object' && val.fullDate) val = val.fullDate;
    const split = val.split(':');
    const fullHour = parseInt(split[0]);
    let h = fullHour % 12;
    if (!h) h = 12;

    hour.current = h;
    minute.current = !split[1] || split[1] == 'undefined' ? '00' : split[1];
    pm.current = fullHour > 11;

    updateState();
  };

  useEffect(() => {
    loadValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const updateStateAndChange = () => {
    updateState();

    const timeObject = {
      hour: hour.current,
      minute: minute.current,
      pm: pm.current,
      fullDate: fullDate(),
      formatted: exportValue()
    };

    onChange(timeObject);
  };

  const handleHourChange = (h) => {
    hour.current = parseInt(h);
    updateStateAndChange();
  };

  const handleMinuteChange = (m) => {
    minute.current = parseInt(m);
    updateStateAndChange();
  };

  const handlePmChange = (tabIndex) => {
    pm.current = !!tabIndex;
    updateStateAndChange();
  };

  return (
    <div className='volta-time_picker'>
      <div className='time_picker-hour'>
        <ComboBox name='time_hour' items={hours} defaultValue={String(hourState)} onSelect={handleHourChange} onChange={handleHourChange} />
      </div>
      <div className='time_picker-div'>:</div>
      <div className='time_picker-minute'>
        <ComboBox name='time_minute' items={minutes} defaultValue={minuteState || '00'} onSelect={handleMinuteChange} onChange={handleMinuteChange} />
      </div>
      <SegmentedControl tabs={TimePicker.pmSelections} onChange={handlePmChange} selectedTabIndex={pmState ? 1 : 0} />
    </div>
  );
};

TimePicker.defaultProps = {
  twentyFourHour: false,
  value: null,
  hour: null,
  minute: null,
  pickSeconds: false,
  minuteInterval: 15,
  onChange: () => {}
}

TimePicker.pmSelections = ['am', 'pm'];

export default TimePicker;
