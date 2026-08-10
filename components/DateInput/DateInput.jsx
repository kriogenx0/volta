import React, { PureComponent, Fragment } from 'react'
import Pikaday from 'pikaday'
import Moment from 'moment'
import { format as formatDate } from 'date-fns'

import PropTypes from 'prop-types'
import { toQaId } from '../../util/formats'
import Readonly from '../DateTime/Readonly/Readonly'
import { dateFormat, isDate } from '../../util/dateTimeUtils'
import Icon from '../Icon/Icon';
import TextInput from '../TextField/TextField';

import './DateInput.scss';

const parseDate = str =>
  Moment(str)
    .tz('UTC')
    .toDate()

export default class DateInput extends PureComponent {
  static propTypes = {
    'data-qa-id': PropTypes.string,
    format: PropTypes.string,
    maxDate: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date),
    onChange: PropTypes.func,
    position: PropTypes.string,
    readonly: PropTypes.bool,
    required: PropTypes.bool,
    value: PropTypes.instanceOf(Date),
  }

  static defaultProps = {
    format: dateFormat,
    position: 'bottom left',
  }

  state = {
    value: this.props.value,
    hasContent: !!this.props.value,
  }

  get qaId() {
    return toQaId({
      parentId: this.props['data-qa-id'],
      componentId: 'DateInput',
    })
  }

  componentWillUnmount() {
    if (this.pikaday) {
      this.pikaday.destroy()
    }
  }

  onChange = (value) => {
    const { onChange } = this.props

    this.setState(
      () => {
        return isDate(value)
          ? {
            hasContent: !!value,
            value,
          }
          : {
            hasContent: false,
            value: null,
          }
      },
      () => {
        if (onChange) {
          onChange(this.state.value)
        }
      },
    )
  }

  showCalendar = (se) => {
    const field = se.target
    const { format, minDate, maxDate, position } = this.props
    const { value } = this.state

    if (this.pikaday) {
      this.pikaday.destroy()
    }

    this.pikaday = new Pikaday({
      field,
      format,
      position,
      onSelect: (value) => {
        this.onChange(value)
      },
      maxDate: maxDate && parseDate(maxDate),
      minDate: minDate && parseDate(minDate),
      value: value && parseDate(value),
    })
  }

  render() {
    const { disabled, format, readonly, required } = this.props

    const { value, hasContent } = this.state
    const formattedValue = value ? formatDate(value, format) : ''

    return readonly ? (
      <Readonly data-qa-id={this.qaId}>{formatDate(value, format)}</Readonly>
    ) : (
      <Fragment>
        <TextInput
          data-qa-id={this.qaId}
          disabled={disabled}
          required={required}
          onChange={this.onChange}
          onFocus={this.showCalendar}
          placeholder="Choose a date"
          prefix={<Icon type="calendar" />}
          suffix={required && !hasContent && <div className="date-error" />}
          value={formattedValue}
        />
      </Fragment>
    )
  }
}
