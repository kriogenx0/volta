import { useState } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import Dropdown from '../Dropdown';
import DropdownListItem from './DropdownListItem';

import './DropdownList.scss';

const DropdownList = ({
    items, // deprecated
    onSelect,
    onToggle,
    options,
    placeholder = 'Select an option',
    selectedOption,
    setPlaceholder = true,
    buttonComponent,
    open
  }) => {

  // Automanage open state unless the parent controls it with `open`
  const [openState, setOpenState] = useState(false);
  const managed = typeof open == 'undefined';
  const isOpen = managed ? openState : open;
  const setOpen = managed ? setOpenState : () => {};

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
    const o = !isOpen;
    setOpen(o);
    onToggle && onToggle(o);
  };

  const handleOptionSelect = (option, index) => {
    onSelect && onSelect(option, index);
    // setSelectedOption(option);
    setOpen(false);
    option.action && option.action();
  };

  let dropdownLabel = placeholder;
  const dropdownListItems = map(options, (option, index) => (
    <DropdownListItem
      key={index}
      role="option"
      onSelect={ handleOptionSelect.bind(null, option, index) }
      isActive={selectedOption === option}
      label={option.label}
    />
  ));

  if (!dropdownListItems.length) {
    dropdownListItems.push(
      <DropdownListItem
        key={0}
        role="option"
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
      className='volta-dropdown_list'
      label={dropdownLabel}
      open={isOpen}
      onClick={handleButtonClick}
      onClose={handleButtonClick}
      buttonComponent={buttonComponent}
    >
      <div role="listbox">
        {dropdownListItems}
      </div>
    </Dropdown>
  );

}

const optionShape = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.any,
  action: PropTypes.func
});

DropdownList.propTypes = {
  buttonComponent: PropTypes.element,
  items: PropTypes.arrayOf(optionShape), // deprecated, use options
  onSelect: PropTypes.func,
  onToggle: PropTypes.func,
  // When `open` is a bool the parent controls the list (onToggle reports every
  // change); when it is left out the list opens and closes itself.
  open: PropTypes.bool,
  options: PropTypes.arrayOf(optionShape),
  placeholder: PropTypes.string,
  selectedOption: optionShape,
  setPlaceholder: PropTypes.bool
};

export default DropdownList;
