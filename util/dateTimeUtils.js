import { isBefore, getHours, getMinutes, getDate, getYear, getMonth } from 'date-fns'

import { dateTimeMessages } from './messages'

export const dateFormat = 'MMM d, yyyy'

export function isDate(date) {
  return date instanceof Date && !isNaN(date)
}

export function isSameDay(dateA, dateB) {
  const dateStringA = `${getYear(dateA)}-${getMonth(dateA)}-${getDate(dateA)}`
  const dateStringB = `${getYear(dateB)}-${getMonth(dateB)}-${getDate(dateB)}`
  return dateStringA === dateStringB
}
// TODO: Replace with new validation functions
// validates start and end dates from a range
export function validateRange(dateStart, dateEnd, requiredStart, requiredEnd) {
  let error = null

  if (dateStart && dateEnd) {
    error = isBefore(dateEnd, dateStart) ? dateTimeMessages.dateRangeError : null
  } else if (requiredStart && requiredEnd) {
    error = 'Missing required field'
  }

  return {
    dateStart: dateStart || null,
    dateEnd: dateEnd || null,
    error,
  }
}

// Extracts a time string out of a date
export function getTime(date) {
  if (!date) {
    return
  }

  const hours = getHours(date)
  const minutes = getMinutes(date)
  return `${hours}:${formatMinutes(minutes)}`
}

function formatMinutes(value) {
  if (!value) {
    return '00'
  }

  return value < 10 ? `0${value}` : value
}
