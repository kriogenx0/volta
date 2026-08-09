import React, { Component } from 'react'
import classnames from 'classnames'
import css from 'styled-jsx/css'
import PropTypes from 'prop-types'
import setHours from 'date-fns/set_hours'
import setMinutes from 'date-fns/set_minutes'

// RMM Shared
import { toQaId } from 'common/formats'
import { DateInput, TimeInput } from 'components/shared/DateTime'
import { dateFormat, getTime, validateRange, isSameDay } from 'components/shared/DateTime/dateTimeUtils'
import Notification from 'components/shared/Notification'

const DATE_START = 'dateStart'
const DATE_END = 'dateEnd'

export default class DateRange extends Component {
  static propTypes = {
    'data-qa-id': PropTypes.string,
    className: PropTypes.string,
    dateEnd: PropTypes.instanceOf(Date),
    dateStart: PropTypes.instanceOf(Date),
    errorEnd: PropTypes.string,
    errorStart: PropTypes.string,
    labelDateStart: PropTypes.string,
    labelDateEnd: PropTypes.string,
    labelTimeStart: PropTypes.string,
    labelTimeEnd: PropTypes.string,
    onChange: PropTypes.func,
    readonly: PropTypes.bool,
    requiredStart: PropTypes.bool,
    requiredEnd: PropTypes.bool,
    showDate: PropTypes.bool,
    showTime: PropTypes.bool,
    style: PropTypes.object,
  }

  static defaultProps = {
    labelDateStart: 'Start Date',
    labelDateEnd: 'End Date',
    labelTimeStart: 'Start Time',
    labelTimeEnd: 'End Time',
    requiredStart: false,
    requiredEnd: false,
    onChange() {
      return false
    },
  }

  state = {
    [DATE_END]: this.props.dateEnd,
    [DATE_START]: this.props.dateStart,
    error: [this.props.errorStart, this.props.errorEnd].filter(Boolean).join(', '),
  }

  get qaId() {
    return toQaId({
      parentId: this.props['data-qa-id'],
      componentId: 'DateRange',
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.dateStart !== prevProps.dateStart) {
      this.setState({ dateStart: this.props.dateStart })
    }

    if (this.props.dateEnd !== prevProps.dateEnd) {
      this.setState({ dateEnd: this.props.dateEnd })
    }

    if (this.props.errorStart !== prevProps.errorStart || this.props.errorEnd !== prevProps.errorEnd) {
      this.setState({
        error: [this.props.errorStart, this.props.errorEnd].filter(Boolean).join(', '),
      })
    }
  }

  handleDateChange = (dateType) => (date) => {
    this.setState(
      (currentState, currentProps) => {
        const { requiredStart, requiredEnd } = currentProps
        const hours = currentState[dateType] ? currentState[dateType].getHours() : 0
        const minutes = currentState[dateType] ? currentState[dateType].getMinutes() : 0
        const nextDate = date ? setHours(setMinutes(date, minutes), hours) : null

        if (dateType === DATE_END) {
          /*
          if we have a start but no end when we are setting the end:
            - we want to add an hour block by default instead of having
            an empty time block throwing an error about the date being in the past
        */
          if (currentState.dateStart && !currentState.dateEnd && isSameDay(currentState.dateStart, nextDate)) {
            const startHours = currentState.dateStart.getHours()
            const startMinutes = currentState.dateStart.getMinutes()
            const nextDatePlusHour = setHours(setMinutes(nextDate, startMinutes), startHours + 1)

            return validateRange(currentState.dateStart, nextDatePlusHour, requiredStart, requiredEnd)
          } else {
            // No special handling needed
            return validateRange(currentState.dateStart, nextDate, requiredStart, requiredEnd)
          }
        } else {
          // dateType === DATE_START
          return validateRange(nextDate, currentState.dateEnd, requiredStart, requiredEnd)
        }
      },
      () => {
        this.props.onChange({ ...this.state })
      },
    )
  }

  handleTimeChange = (dateType, validate) => ({ value, error }) => {
    this.setState(
      (currentState, currentProps) => {
        if (error) {
          return { error }
        }

        const { requiredStart, requiredEnd } = currentProps
        const [hours, minutes] = value.split(':')

        let nextDate = currentState[dateType]

        if (minutes) {
          nextDate = setMinutes(nextDate, minutes)
        }

        if (hours) {
          nextDate = setHours(nextDate, hours)
        }

        if (validate) {
          return dateType === DATE_START
            ? validateRange(nextDate, currentState.dateEnd, requiredStart, requiredEnd)
            : validateRange(currentState.dateStart, nextDate, requiredStart, requiredEnd)
        } else {
          return {
            // [dateType]: nextDate,
            error: '',
          }
        }
      },
      () => {
        this.props.onChange({ ...this.state })
      },
    )
  }

  render() {
    const {
      className,
      labelDateEnd,
      labelDateStart,
      labelTimeEnd,
      labelTimeStart,
      readonly,
      requiredStart,
      requiredEnd,
      showDate,
      showTime,
      style,
    } = this.props
    const { dateEnd, dateStart, error } = this.state
    const startTime = getTime(dateStart)
    const endTime = getTime(dateEnd)

    return (
      <div className={classnames('date-range', { [className]: className })} data-qa-id={this.qaId} style={{ ...style }}>
        <div className="range-controls">
          <div className="range-control">
            {showDate && (
              <label>
                {(labelDateStart || labelDateStart === '') && <div className="label-text">{labelDateStart}</div>}
                <DateInput
                  data-qa-id={toQaId({
                    componentId: this.qaId,
                    useId: 'DateStart',
                  })}
                  format={dateFormat}
                  maxDate={dateEnd !== '' && dateEnd}
                  onChange={this.handleDateChange(DATE_START)}
                  position="bottom left"
                  readonly={readonly}
                  required={requiredStart}
                  value={dateStart}
                />
              </label>
            )}

            {showTime && (
              <label>
                {(labelTimeStart || labelTimeStart === '') && <div className="label-text">{labelTimeStart}</div>}
                <TimeInput
                  data-qa-id={toQaId({
                    componentId: this.qaId,
                    useId: 'TimeStart',
                  })}
                  value={startTime}
                  readonly={readonly}
                  onBlur={this.handleTimeChange(DATE_START, true)}
                  onChange={this.handleTimeChange(DATE_START)}
                />
              </label>
            )}
          </div>

          <div className="range-control">
            {showDate && (
              <label>
                {(labelDateEnd || labelDateEnd === '') && <div className="label-text">{labelDateEnd}</div>}
                <DateInput
                  data-qa-id={toQaId({
                    componentId: this.qaId,
                    useId: 'DateEnd',
                  })}
                  format={dateFormat}
                  minDate={dateStart}
                  onChange={this.handleDateChange(DATE_END)}
                  position="bottom left"
                  readonly={readonly}
                  required={requiredEnd}
                  value={dateEnd}
                />
              </label>
            )}

            {showTime && (
              <label>
                {(labelTimeEnd || labelTimeEnd === '') && <div className="label-text">{labelTimeEnd}</div>}
                <TimeInput
                  data-qa-id={toQaId({
                    componentId: this.qaId,
                    useId: 'TimeEnd',
                  })}
                  value={endTime}
                  readonly={readonly}
                  onBlur={this.handleTimeChange(DATE_END, true)}
                  onChange={this.handleTimeChange(DATE_END)}
                />
              </label>
            )}
          </div>
        </div>

        {error && <Notification variant="error">{error}</Notification>}

        <style jsx>{styles}</style>
      </div>
    )
  }
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
