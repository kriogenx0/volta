// https://react-select.com
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames'
import isEqual from '../../util/isEqual'
import ReactSelect from 'react-select'
import {
  customStyles,
  DropdownIndicator,
  initTheme,
  MultiValueRemove,
  orderFixedOptions,
} from './selectMenuTheme'

// Shared so a default keeps one identity between renders
const NONE = []

const MultiSelect = ({
  'aria-label': ariaLabel, className, classNamePrefix = 'multi-select', clearable = false, defaultValue = NONE,
  closeMenuOnSelect, disabled, multiselect = true, noOptionsMessage = 'No options available', name, onChange, options, placeholder,
  value: valueProp = NONE,
}) => {
  // We use defaultValue to init and then for things like resetting when clearing
  const initialDefaultValue = useRef([...defaultValue]);
  // A value passed from the start wins over defaultValue
  const [value, setValue] = useState(() => [...(valueProp.length ? valueProp : defaultValue)]);
  const prevValueProp = useRef(valueProp);

  useEffect(() => {
    if (!isEqual(valueProp, prevValueProp.current)) {
      setValue([...valueProp]);
    }
    prevValueProp.current = valueProp;
  }, [valueProp]);

  const handleSelection = (selected, event) => {
    const { action, removedValue } = event
    // react-select hands over an array when multi, a single option (or null) otherwise
    let nextValue = Array.isArray(selected) ? [...selected] : (selected ? [selected] : [])

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
      aria-label={ariaLabel}
      backspaceRemovesValue
      // react-select blurs the box after a choice on a touch device, which would close the menu again
      blurInputOnSelect={false}
      className={classnames('volta-multi_select', { [className]: className })}
      classNamePrefix={classNamePrefix}
      // Several choices in a row: the menu stays open after each one (a single choice closes it)
      closeMenuOnSelect={closeMenuOnSelect === undefined ? !multiselect : closeMenuOnSelect}
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
  // Names the search input for assistive tech; give one unless a label points at it
  'aria-label': PropTypes.string,
  className: PropTypes.string,
  clearable: PropTypes.bool,
  // Close the menu after each choice. Off by default for a multiple choice, so several can be picked in a row; on for a single choice.
  closeMenuOnSelect: PropTypes.bool,
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
  // false for a single choice; onChange still receives an array (of one)
  multiselect: PropTypes.bool,
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

export default MultiSelect;
