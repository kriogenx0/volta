import React from 'react'
import { components } from 'react-select'
import colors from '../../styles/_shared/colors';

// https://react-select.com/styles#overriding-the-theme
export const customStyles = {
  control: (baseStyles) => ({
    ...baseStyles,
    borderColor: colors.multiselect.border,
    boxShadow: 'none',
    lineHeight: 1,
    ':focused': {
      borderColor: colors.multiselect.border,
    },
    ':hover': {
      borderColor: colors.multiselect.border,
    },
  }),
  valueContainer: (styles) => ({
    ...styles,
    paddingLeft: '1em',
  }),
  option: (baseStyles) => ({
    ...baseStyles,
    cursor: 'pointer',
    color: colors.multiselect.text,
    ':hover': {
      color: colors.multiselect.text,
    },
  }),
  placeholder: (baseStyles) => ({
    ...baseStyles,
    color: colors.text.bodyCopy,
  }),
  multiValue: (baseStyles) => ({
    ...baseStyles,
    border: `1px solid ${colors.border}`,
    borderRadius: 4,
  }),
  multiValueLabel: (baseStyles) => ({
    ...baseStyles,
    color: colors.multiselect.text,
    fontSize: '1rem',
    paddingLeft: '6px',
    paddingRight: '6px',
  }),
  multiValueRemove: (baseStyles, state) => {
    return state.data.fixed
      ? {
        ...baseStyles,
        display: 'none',
      }
      : {
        ...baseStyles,
        cursor: 'pointer',
        ':hover': {
          backgroundColor: colors.background,
          color: colors.multiselect.text,
        },
      }
  },
  dropdownIndicator: (baseStyles) => ({
    ...baseStyles,
    color: colors.border,
  }),
  indicatorSeparator: (baseStyles) => ({
    ...baseStyles,
    display: 'none',
  }),
}

export function initTheme(theme) {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary25: colors.multiselect.primary25,
      primary: colors.multiselect.primary25,
      neutral10: colors.multiselect.neutral10,
    },
    spacing: {
      baseUnit: 4,
      controlHeight: 36,
      menuGutter: 4,
    },
  }
}

export const MultiValueRemove = (props) => (
  <components.MultiValueRemove {...props}>
    <span style={{ fontFamily: 'Volta Icons', color: colors.multiselect.iconColor }}>{'\uF049'}</span>
  </components.MultiValueRemove>
)

export const DropdownIndicator = (props) =>
  components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      <span
        style={{
          color: colors.multiselect.text,
          fontFamily: 'Volta Icons',
          fontSize: 21,
          marginRight: 7,
        }}
      >
        {'\uF000'}
      </span>
    </components.DropdownIndicator>
  )

export function orderFixedOptions(values) {
  return values.filter((v) => v.fixed).concat(values.filter((v) => !v.fixed))
}
