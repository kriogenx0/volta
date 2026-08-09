import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

// RMM Shared
import { Readonly } from 'components/shared/DateTime'
import { toQaId } from 'common/formats'
import { validateTime } from 'common/services/dateTime'
import Icon from 'components/shared/Icon'
import TextInput from 'components/shared/forms/TextInput'

const TimeInput = ({
  'data-qa-id': dataQaId,
  className,
  error: errorProp,
  onChange,
  onBlur,
  readonly,
  required,
  style = {},
  value = '',
  ...props
}) => {
  const [time, setTime] = useState(value)
  const [error, setError] = useState(errorProp)
  const qaId = toQaId({
    parentId: dataQaId,
    componentId: 'TimeInput',
  })

  useEffect(() => {
    setTime(value)
  }, [value])

  useEffect(() => {
    setError(errorProp)
  }, [errorProp])

  function handleTimeChange(se) {
    setTime(se.target.value)
    setError(null)

    if (onChange) {
      onChange({ value: se.target.value, error: null })
    }
  }

  function handleBlur() {
    let errorMessage

    if (time) {
      const timeValidation = validateTime({ time })
      errorMessage = !timeValidation.valid
        ? timeValidation.errors.join(', ')
        : null
    }

    setError(errorMessage)

    if (onBlur) {
      onBlur({ value: time, error: errorMessage })
    }
  }

  return readonly ? (
    <Readonly className={classnames({ [className]: className })} data-qa-id={qaId} style={style}>
      {time}
    </Readonly>
  ) : (
    <TextInput
      className={classnames({ [className]: className })}
      data-qa-id={qaId}
      error={!!error}
      onBlur={handleBlur}
      onChange={handleTimeChange}
      placeholder="00:00"
      prefix={<Icon type="clock" />}
      required={required}
      style={style}
      type="text"
      value={time}
      {...props}
    />
  )
}

TimeInput.propTypes = {
  'data-qa-id': PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  style: PropTypes.object,
  value: PropTypes.string,
}

export default TimeInput
