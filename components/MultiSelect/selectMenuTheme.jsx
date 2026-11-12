import './MultiSelect.scss';
import React from 'react'
import { components } from 'react-select'
import Icon from '../Icon'

// react-select styles itself with fixed colours and corners, so every colour and corner here
// is a theme token (a CSS variable): the control follows light and dark mode, a custom accent,
// and the square, rounded and pill shapes (Theme.setShape).
// https://react-select.com/styles#overriding-the-theme
const text = 'var(--v-color-trim)';
const subtle = 'var(--v-color-trim-subtle)';
const border = 'var(--v-color-base-less-subtle)';

// The same text size as the other fields (14px), for the typed text, the chips and the menu
const fontSize = 14;

export const customStyles = {
  container: (baseStyles) => ({
    ...baseStyles,
    fontSize,
  }),
  control: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: 'var(--v-color-base)',
    borderRadius: 'var(--v-radius-md)',
    minHeight: 40,
    borderColor: state.isFocused ? 'var(--v-accent)' : border,
    boxShadow: state.isFocused ? '0 0 0 2px var(--v-accent)' : 'none',
    lineHeight: 1,
    // A disabled control takes no part: no hover colour, dimmed
    ':hover': state.isDisabled ? {} : {
      borderColor: state.isFocused ? 'var(--v-accent)' : 'var(--v-color-trim-less-subtle)',
    },
    opacity: state.isDisabled ? 0.5 : 1,
    cursor: state.isDisabled ? 'not-allowed' : baseStyles.cursor,
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
    borderRadius: 'var(--v-radius-md)',
    // Keeps the options inside the rounded corners, whatever the shape
    overflow: 'hidden',
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
    borderRadius: 'var(--v-radius-md)',
    overflow: 'hidden',
  }),
  multiValueLabel: (baseStyles) => ({
    ...baseStyles,
    color: text,
    fontSize,
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

// SVG icons (no icon font to load), drawn in the colour of the control so they follow the theme
export const MultiValueRemove = (props) => (
  <components.MultiValueRemove {...props}>
    <Icon type="xmark" className="volta-multiselect-icon" aria-hidden="true" />
  </components.MultiValueRemove>
)

export const DropdownIndicator = (props) =>
  components.DropdownIndicator && (
    <components.DropdownIndicator {...props}>
      <Icon type="chevron.down" className="volta-multiselect-icon volta-multiselect-icon--indicator" aria-hidden="true" />
    </components.DropdownIndicator>
  )

export function orderFixedOptions(values) {
  return values.filter((v) => v.fixed).concat(values.filter((v) => !v.fixed))
}
