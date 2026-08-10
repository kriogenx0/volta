import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { map, forEach } from 'lodash';

import Dropdown from '../Dropdown';
import DropdownListItem from './DropdownListItem';

import './DropdownList.scss';

const DropdownList = ({
    items, // deprecated
    onSelect,
    onToggle,
    options,
    placeholder,
    selectedOption,
    setPlaceholder,
    buttonComponent,
    open
  }) => {

  let setOpen;
  if (typeof open == 'undefined') {
    [open, setOpen] = useState(false);
  } else {
    setOpen = () => {};
  }

  if (!options && items) {
    console.warn("DropdownList no longer accepts 'items'. Please use 'options' instead.");
    options = items;
  }

  // Selected Option
  /*
  if (typeof selectedOption != 'undefined') {
    forEach(options, option => {
      if (option === selectedOption) {
        setSelectedOption(option);
        return false;
      }
    });
  } else if (typeof value !== 'undefined') { // deprecate this
    forEach(options, option => {
      if (typeof(option.value) != 'undefined' && option.value == value) {
        setSelectedOption(option);
        return false;
      }
    });
  }
  */

  const handleButtonClick = () => {
    const o = !open;
    setOpen(o);
    onToggle && onToggle(o);
  };

  const handleOptionSelect = (option, index) => {
    onSelect && onSelect(option, index);
    // setSelectedOption(option);
    setOpen(false);
  };

  let dropdownLabel = placeholder;
  const dropdownListItems = map(options, (option, index) => (
    <DropdownListItem
      key={index}
      onSelect={ handleOptionSelect.bind(null, option, index) }
      active={selectedOption === option}
      label={option.label}
    />
  ));

  if (!dropdownListItems.length) {
    dropdownListItems.push(
      <DropdownListItem
        key={0}
        disabled={true}
        label="No options available."
      />
    );
  }

  if (selectedOption && setPlaceholder) {
    dropdownLabel = selectedOption.label;
  }

  return (
    <Dropdown
      className='v-dropdown_list'
      label={dropdownLabel}
      open={open}
      onClick={handleButtonClick}
      onClose={handleButtonClick}
      buttonComponent={buttonComponent}
    >
      {dropdownListItems}
    </Dropdown>
  );

}

DropdownList.propTypes = {
  placeholder: PropTypes.string,
  // open: PropTypes.bool, // If bool is set, then the value is never undefined, cannot be detected to automatically be managed.
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
    action: PropTypes.func
  })),
  onSelect: PropTypes.func,
  setPlaceholder: PropTypes.bool
};

DropdownList.defaultProps = {
  // open: false, // If bool is set, then the value is never undefined, cannot be detected to automatically be managed.
  placeholder: 'Select an option',
  setPlaceholder: true
};

export default DropdownList;
