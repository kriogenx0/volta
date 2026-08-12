import { useState } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import Button from "../Button";
import Dropdown from "../Dropdown";
import DropdownListItem from "../DropdownList/DropdownListItem";
import Icon from "../Icon";

import "../DropdownList/DropdownList.scss"; // For DropdownList styles
import "./ActionMenu.scss";

const ActionMenu = ({ onToggle, items, onSelect }) => {
  const [open, setOpen] = useState(false);

  // on button click
  const handleButtonClick = () => {
    const o = !open;
    setOpen(o);
    onToggle && onToggle(o);
  };

  const handleItemSelect = (item, index) => {
    onSelect(item, index);
    setOpen(false);
    item.action && item.action();
  };

  const buttonComponent = (
    <Button variant="link" onClick={handleButtonClick}>
      <Icon type="ellipsis"/>
    </Button>
  );

  const dropdownListItems = map(items, (item, index) => (
    <DropdownListItem
      key={index}
      onSelect={ handleItemSelect.bind(this, item, index) }
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
      {dropdownListItems}
    </Dropdown>
  );

};

ActionMenu.propTypes = {
  items: PropTypes.array,
  onSelect: PropTypes.func,
  onToggle: PropTypes.func
};

ActionMenu.defaultProps = {
  onSelect: () => {}
};

export default ActionMenu;
