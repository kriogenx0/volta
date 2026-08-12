// https://react-select.com
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames'
import isEqual from 'lodash/isEqual'
import ReactSelect from 'react-select'
import {
  customStyles,
  DropdownIndicator,
  initTheme,
  MultiValueRemove,
  orderFixedOptions,
} from './selectMenuTheme'

const MultiSelect = ({
  className, classNamePrefix, clearable, defaultValue, disabled, multiselect,
  noOptionsMessage, name, onChange, options, placeholder, value: valueProp,
}) => {
  // We use defaultValue to init and then for things like resetting when clearing
  const initialDefaultValue = useRef([...defaultValue]);
  const [value, setValue] = useState([...defaultValue]);
  const prevValueProp = useRef(valueProp);

  useEffect(() => {
    if (!isEqual(valueProp, prevValueProp.current)) {
      setValue([...valueProp]);
    }
    prevValueProp.current = valueProp;
  }, [valueProp]);

  const handleSelection = (selected, event) => {
    const { action, removedValue } = event
    let nextValue = [...selected]

    switch (action) {
      case 'remove-value':
      case 'pop-value':
        // exit out of the event handler w/o changing state
        if (removedValue.fixed) {
          return
        }
        break
      case 'clear':
        nextValue = initialDefaultValue.current.filter((v) => v.fixed)
        break
    }

    setValue(nextValue);
    if (onChange) {
      onChange(nextValue, event)
    }
  }

  const orderedDefaultValue = orderFixedOptions(defaultValue)
  const orderedValue = orderFixedOptions(value)

  return (
    <ReactSelect
      backspaceRemovesValue
      className={classnames('volta-multi_select', { [className]: className })}
      classNamePrefix={classNamePrefix}
      closeMenuOnSelect
      components={{ MultiValueRemove, DropdownIndicator }}
      defaultValue={orderedDefaultValue}
      hideSelectedOptions
      isClearable={clearable}
      isDisabled={disabled}
      isMulti={multiselect}
      name={name}
      noOptionsMessage={() => noOptionsMessage}
      onChange={handleSelection}
      options={options}
      placeholder={placeholder}
      styles={customStyles}
      theme={initTheme}
      value={orderedValue}
    />
  )
};

MultiSelect.propTypes = {
  className: PropTypes.string,
  clearable: PropTypes.bool,
  classNamePrefix: PropTypes.string,
  // defaultValue is purely used for init
  defaultValue: PropTypes.arrayOf(
    PropTypes.shape({
      fixed: PropTypes.bool,
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    }),
  ),
  disabled: PropTypes.bool,
  noOptionsMessage: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    }),
  ),
  placeholder: PropTypes.string,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      fixed: PropTypes.bool,
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    }),
  ),
}

MultiSelect.defaultProps = {
  classNamePrefix: 'multi-select',
  clearable: false,
  defaultValue: [],
  multiselect: true,
  noOptionsMessage: 'No options available',
  value: [],
}

export default MultiSelect;
