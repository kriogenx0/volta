import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import NavSidebarItem from './NavSidebarItem.jsx';

import './NavSidebar.scss';
import { each } from '../../util/collection';

// A shared fallback: a fresh `[]` default on every render would retrigger the
// effect below forever.
const NO_ITEMS = [];

// The side navigation: a tree of NavItem objects, expandable where an item has children,
// router-aware (the item for the current path is highlighted).
const NavSidebar = ({ navItems = NO_ITEMS, onActiveState }) => {
  const [items, setItems] = useState(navItems);

  useEffect(() => {
    setItems(navItems);
  }, [navItems]);

  const handleToggle = (navItem) => {
    navItem.setExpanded(!navItem.isExpanded());

    // force to render
    setItems((prev) => [...prev]);
  };

  const buildNavItemElements = (navItems, navLevel) => {
    var navItemElements = [];
    navLevel = navLevel || 0;

    each(navItems, (navItem) => {
      var navBarItem = (<NavSidebarItem navLevel={navLevel}
                                    navItem={navItem}
                                    key={navItem.key}
                                    onToggle={handleToggle}
                                    onActiveState={onActiveState} />);

      navItemElements.push(navBarItem);

      // Build children
      if (navItem.isExpanded() && navItem.hasChildren()) {
        navItemElements = navItemElements.concat(buildNavItemElements(navItem.children, ++navLevel))
        navLevel--;
      }
    });

    return navItemElements;
  };

  var navItemElements = buildNavItemElements(items);

  return (
    <div className="volta-nav_sidebar no-select">
      {navItemElements}
    </div>
  );
};

NavSidebar.propTypes = {
  navItems: PropTypes.array, // NavItem instances
  onActiveState: PropTypes.func // called with the NavItem whose link matches the current path
};

export { NavSidebar };
export default NavSidebar;
