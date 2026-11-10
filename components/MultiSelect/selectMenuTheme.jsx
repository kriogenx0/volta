import './MultiSelect.scss';
import React from 'react'
import { components } from 'react-select'

// react-select styles itself with fixed colours, so every colour here is a theme
// token (a CSS variable): the control follows light and dark mode, and a custom accent.
// https://react-select.com/styles#overriding-the-theme
const text = 'var(--v-color-trim)';
const subtle = 'var(--v-color-trim-subtle)';
const border = 'var(--v-color-base-less-subtle)';

export const customStyles = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: 'var(--v-color-base)',
    minHeight: 40,
    borderColor: state.isFocused ? 'var(--v-accent)' : border,
    boxShadow: state.isFocused ? '0 0 0 2px var(--v-accent)' : 'none',
    lineHeight: 1,
    ':hover': {
      borderColor: state.isFocused ? 'var(--v-accent)' : 'var(--v-color-trim-less-subtle)',
    },
  }),
  valueContainer: (styles) => ({
    ...styles,
    paddingLeft: '1em',
  }),
  input: (baseStyles) => ({
    ...baseStyles,
    color: text,
  }),
  singleValue: (baseStyles) => ({
    ...baseStyles,
    color: text,
  }),
  menu: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: 'var(--v-color-base)',
    border: `1px solid ${border}`,
    boxShadow: 'var(--v-shadow-md)',
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    cursor: 'pointer',
    color: state.isSelected ? 'var(--v-on-accent)' : text,
    backgroundColor: state.isSelected
      ? 'var(--v-accent)'
      : state.isFocused ? 'var(--v-color-base-subtle)' : 'transparent',
    ':active': {
      backgroundColor: 'var(--v-accent-subtle)',
    },
  }),
  placeholder: (baseStyles) => ({
    ...baseStyles,
    color: subtle,
  }),
  noOptionsMessage: (baseStyles) => ({
    ...baseStyles,
    color: subtle,
  }),
  multiValue: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: 'var(--v-color-base-subtle)',
    border: `1px solid ${border}`,
    borderRadius: 4,
  }),
  multiValueLabel: (baseStyles) => ({
    ...baseStyles,
    color: text,
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
        color: subtle,
        ':hover': {
          backgroundColor: 'var(--v-color-base-more-subtle)',
          color: text,
        },
      }
  },
  dropdownIndicator: (baseStyles) => ({
    ...baseStyles,
    color: subtle,
    ':hover': { color: text },
  }),
  clearIndicator: (baseStyles) => ({
    ...baseStyles,
    color: subtle,
    ':hover': { color: text },
  }),
  indicatorSeparator: (baseStyles) => ({
    ...baseStyles,
    display: 'none',
  }),
}

export function initTheme(theme) {
  return {
    ...theme,
    spacing: {
      baseUnit: 4,
      controlHeight: 36,
      menuGutter: 4,
    },
  }
}

// The glyphs take their colour from the control (currentColor), so they follow the theme too
export const MultiValueRemove = (props) => (
  <components.MultiValueRemove {...props}>
    <span className="volta-multiselect-icon">{'\uF049'}</span>
  </components.MultiValueRemove>
)

export const DropdownIndicator = (props) =>
  components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      <span className="volta-multiselect-icon volta-multiselect-icon--indicator">
        {'\uF000'}
      </span>
    </components.DropdownIndicator>
  )

export function orderFixedOptions(values) {
  return values.filter((v) => v.fixed).concat(values.filter((v) => !v.fixed))
}
