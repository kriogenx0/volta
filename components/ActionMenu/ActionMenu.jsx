import { useState } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import Button from "../Button";
import Dropdown from "../Dropdown";
import DropdownListItem from "../DropdownList/DropdownListItem";
import Icon from "../Icon";

import "../DropdownList/DropdownList.scss"; // For DropdownList styles
import "./ActionMenu.scss";

const ActionMenu = ({ onToggle, items, onSelect = () => {} }) => {
  const [open, setOpen] = useState(false);

  // on button click
  const handleButtonClick = () => {
    const o = !open;
    setOpen(o);
    onToggle && onToggle(o);
  };

  // Choosing an item closes the menu and says so: Dropdown no longer closes on
  // every click inside, and onToggle reports every change.
  const handleItemSelect = (item, index) => {
    onSelect(item, index);
    setOpen(false);
    onToggle && onToggle(false);
    item.action && item.action();
  };

  const buttonComponent = (
    <Button variant="link" onClick={handleButtonClick} aria-label="Actions" aria-haspopup="menu" aria-expanded={open}>
      <Icon type="ellipsis" aria-hidden="true" />
    </Button>
  );

  const dropdownListItems = map(items, (item, index) => (
    <DropdownListItem
      key={index}
      onSelect={() => handleItemSelect(item, index)}
      label={item.label || item}
    />
  ));

  const props = {
    className: 'volta-action_menu',
    buttonComponent,
    onClick: handleButtonClick,
    onClose: handleButtonClick,
    open
  };

  return (
    <Dropdown {...props}>
      <div role="menu">
        {dropdownListItems}
      </div>
    </Dropdown>
  );

};

ActionMenu.propTypes = {
  // Each item is a label, or an object with a label and an optional action to run when it is chosen
  items: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      action: PropTypes.func
    })
  ])),
  onSelect: PropTypes.func,
  onToggle: PropTypes.func
};

export default ActionMenu;
