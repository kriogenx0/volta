// https://react-select.com
import { Component } from 'react';
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
// } from 'common/styles/selectMenuTheme'

export default class MultiSelect extends Component {
  static propTypes = {
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

  static defaultProps = {
    classNamePrefix: 'multi-select',
    clearable: false,
    defaultValue: [],
    multiselect: true,
    noOptionsMessage: 'No options available',
    value: [],
  }

  // We use defaultValue to init and then for things like resetting when clearing
  defaultValue = [...this.props.defaultValue]

  state = {
    value: [...this.props.defaultValue],
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(this.props.value, prevProps.value)) {
      this.setState({
        value: [...this.props.value],
      })
    }
  }

  handleSelection = (value, event) => {
    const { onChange } = this.props
    const { action, removedValue } = event
    let nextValue = [...value]

    switch (action) {
      case 'remove-value':
      case 'pop-value':
        // exit out of the event handler w/o changing state
        if (removedValue.fixed) {
          return
        }
        break
      case 'clear':
        nextValue = this.defaultValue.filter((v) => v.fixed)
        break
    }

    this.setState({ value: nextValue }, () => {
      if (onChange) {
        onChange(this.state.value, event)
      }
    })
  }

  render() {
    const {
      className,
      classNamePrefix,
      clearable,
      defaultValue,
      disabled,
      multiselect,
      noOptionsMessage,
      name,
      options,
      placeholder,
    } = this.props

    const { value } = this.state

    const orderedDefaultValue = orderFixedOptions(defaultValue)
    const orderedValue = orderFixedOptions(value)

    return (
      <ReactSelect
        backspaceRemovesValue
        className={classnames({ [className]: className })}
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
        onChange={this.handleSelection}
        options={options}
        placeholder={placeholder}
        styles={customStyles}
        theme={initTheme}
        value={orderedValue}
      />
    )
  }
}
