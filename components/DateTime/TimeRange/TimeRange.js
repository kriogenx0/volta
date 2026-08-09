import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import css from 'styled-jsx/css'
import uniq from 'lodash/uniq'

import { toQaId } from 'common/formats'
import { validateTimeRange } from 'common/services/dateTime'
import { TimeInput } from 'components/shared/DateTime'
import Notification from 'components/shared/Notification'

const TIME_START = 'timeStart'
const TIME_END = 'timeEnd'

// type TimeRangeProps = {
//   'data-qa-id': string,
//   className: string,
//   errorEnd: string,
//   errorStart: string,
//   labelStart: string,
//   labelEnd: string,
//   onChange: Function,
//   readonly: boolean,
//   requiredEnd: boolean,
//   requiredStart: boolean,
//   style: {
//     [key: string]: number | string
//   },
//   timeEnd: string,
//   timeStart: string,
// }

const TimeRange = (props) => {
  const {
    'data-qa-id': dataQaId,
    className,
    errorEnd,
    errorStart,
    labelEnd,
    labelStart,
    onChange,
    readonly,
    requiredEnd,
    requiredStart,
    style,
    timeEnd,
    timeStart,
  } = props

  const [startTime, setStartTime] = useState(timeStart)
  const [endTime, setEndTime] = useState(timeEnd)
  const [error, setError] = useState([errorStart, errorEnd].filter(Boolean).join(', '))

  useEffect(() => {
    setError(errorEnd)
  }, [errorEnd])

  useEffect(() => {
    setError(errorStart)
  }, [errorStart])

  const qaId = toQaId({
    parentId: dataQaId,
    componentId: 'TimeRange',
  })

  const handleTimeChange = (type, validate) => ({ value, error }) => {
    const start = type === TIME_START ? value : startTime
    const end = type === TIME_END ? value : endTime

    let errorMessage

    if (validate) {
      const timeValidation = validateTimeRange({ timeStart: start, timeEnd: end })
      errorMessage = uniq([error, ...timeValidation.errors])
        .filter(Boolean)
        .join(', ')
    } else {
      errorMessage = uniq([error])
        .filter(Boolean)
        .join(', ')
    }

    setStartTime(start)
    setEndTime(end)
    setError(errorMessage)

    onChange({
      timeStart: start,
      timeEnd: end,
      error: errorMessage,
    })
  }

  return (
    <div className={classnames('time-range', { [className]: className })} data-qa-id={qaId} style={{ ...style }}>
      <div className="range-controls">
        <div className="range-control">
          <label>
            {(labelStart || labelStart === '') && <div className="label-text">{labelStart}</div>}
            <TimeInput
              data-qa-id={toQaId({
                componentId: qaId,
                useId: 'TimeStart',
              })}
              onBlur={handleTimeChange(TIME_START, true)}
              onChange={handleTimeChange(TIME_START)}
              readonly={readonly}
              required={requiredStart}
              value={startTime}
            />
          </label>
        </div>

        <div className="range-control">
          <label>
            {(labelEnd || labelEnd === '') && <div className="label-text">{labelEnd}</div>}
            <TimeInput
              data-qa-id={toQaId({
                componentId: qaId,
                useId: 'TimeEnd',
              })}
              onBlur={handleTimeChange(TIME_END, true)}
              onChange={handleTimeChange(TIME_END)}
              readonly={readonly}
              required={requiredEnd}
              value={endTime}
            />
          </label>
        </div>
      </div>

      {error && <Notification variant="error">{error}</Notification>}

      <style jsx>{styles}</style>
    </div>
  )
}

TimeRange.defaultProps = {
  labelEnd: 'End Time',
  labelStart: 'Start Time',
  requiredEnd: false,
  requiredStart: false,
  style: {},
  onChange() {
    return false
  },
}

const styles = css`
  label {
    display: block;
  }

  .label-text {
    height: 20px;
    margin-bottom: 8px;
  }

  .range-controls {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .range-control {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`

export default TimeRange
