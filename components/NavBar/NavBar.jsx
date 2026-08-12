import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import NavBarItem from "./NavBarItem.jsx";

import './NavBar.scss';

const NavBar = ({ navItems, onActiveState }) => {
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

    _.each(navItems, (navItem) => {
      var navBarItem = (<NavBarItem navLevel={navLevel}
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
    <div className="volta-navbar no-select">
      {navItemElements}
    </div>
  );
};

NavBar.propTypes = {
  navItems: PropTypes.array,
  onActiveState: PropTypes.func
};

NavBar.defaultProps = {
  navItems: []
};

export default NavBar;
