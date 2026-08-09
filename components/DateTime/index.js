import React from 'react';
import ReactDOM from 'react-dom';

import parse from 'date-fns/parse'
// import { renderReactComponent } from '../../../helpers/react'
import { DateTime } from 'luxon'
import { isDate } from './dateTimeUtils'
import DateRange from './DateRange'
import TimeRange from './TimeRange'

export { DateRange, TimeRange }
export { default as DateInput } from './DateInput'
export { default as TimeInput } from './TimeInput'
export { default as Readonly } from './Readonly'

export const renderDateRange = ({ selector, ...props }) => {
  const mutatedProps = { ...props }
  const localTimezone = DateTime.local().zoneName

  if (props.dateStart) {
    mutatedProps.dateStart =
      props.sessionType === 'talent_led'
        ? importDateToTimezone(props.dateStart, props.timezone, localTimezone)
        : parse(props.dateStart)
  }

  if (props.dateEnd) {
    mutatedProps.dateEnd =
      props.sessionType === 'talent_led'
        ? importDateToTimezone(mutatedProps.dateEnd, props.timezone, localTimezone)
        : parse(props.dateEnd)
  }

  if (props.onChange) {
    mutatedProps.onChange = ({ dateStart, dateEnd, error }) => {
      const changedDates = { dateStart, dateEnd, error }

      if (isDate(dateStart)) {
        changedDates.dateStart =
          props.sessionType === 'talent_led' ? exportDateToTimezone(dateStart, props.timezone) : dateStart.toISOString()
      }

      if (isDate(dateEnd)) {
        changedDates.dateEnd =
          props.sessionType === 'talent_led' ? exportDateToTimezone(dateEnd, props.timezone) : dateEnd.toISOString()
      }

      props.onChange(changedDates)
    }
  }

  // renderReactComponent(DateRange, mutatedProps, selector)
  ReactDOM.render(React.createElement(Component, props), document.querySelector(selector))
}

/*
- Takes UTC time from the DB and extracts, then implements clock time for a given timezone timezones
- clock time is the concept of time without the constraints of a timezone
for ex: I want to wake up at 7 o'clock local time where ever I am

type ImportType = {
  utcDateString: string, // ex: '2019-05-09T21:00:00Z'
  storeTZ: string, // IANA Timezone | ex: 'America/Los_Angeles'
  localTZ: string, // IANA Timezone | ex: 'America/Los_Angeles'
}

returns: Date
*/
function importDateToTimezone(utcDateString, storeTZ, localTZ) {
  /* storeTime:
    - The utcDateString from the DB needs to be converted into a new luxon
    object so we can manipulate it.
    - We chain on the conversion, the setting or the stores timezone to get
    the stores clock time for the session
    - We set `keepLocalTime` to false bc we want the utc time to be converted to the
    stores local clock time to access in the following step
    - This will be an object representing the converted time to the stores timezone

    ex:
    const iso = new Date().fromISO(utcDateString).toISO() // '2019-05-07T22:05:09-07:00'
    const override = iso.setZone('America/Denver', { keepLocalTime: false }).toISO() // '2019-05-07T23:05:09-06:00'
  */
  const storeTime = DateTime.fromISO(utcDateString).setZone(storeTZ, {
    keepLocalTime: false,
  })
  /* localClockTime:
    - We set the timezone here to the timezone the app is running in but
    set `keepLocalTime` to true to preserve the clock time from the store
    - This will be an object in local time but it will be using the time from the store,
    it will not convert it to the local time
    - This allows us to simulate setting time in a different timezone

    ex:
    const iso = new Date().fromISO(utcDateString).toISO() // '2019-05-07T23:05:09-07:00'
    const override = iso.setZone('America/Denver', { keepLocalTime: true }).toISO() // '2019-05-07T23:05:09-06:00'
  */
  const localClockTime = storeTime.setZone(localTZ, { keepLocalTime: true })

  return localClockTime.toJSDate()
}

/*
- Takes a date from the react component and processes it to be saved
in correct clock time for the store and its timezone

type ExportType = {
  jsDate: Date,
  storeTZ: string, // IANA Timezone | ex: 'America/Los_Angeles'
}

returns string // ex: '2019-05-09T21:00:000-06:00'
*/
function exportDateToTimezone(jsDate, storeTZ) {
  /*
    - We take the time returned from the component and change it to the stores timezone
    - We extract and implements clock time from the component into the target stores timezone
  */
  const storeTime = DateTime.fromJSDate(jsDate).setZone(storeTZ, {
    keepLocalTime: true,
  })
  return storeTime.toISO()
}
