import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

const toRoute = (navItem) => ({
  pathname: navItem.linkTo,
  search: navItem.query ? `?${new URLSearchParams(navItem.query).toString()}` : ''
});

const NavBarItem = ({ navItem, navLevel, onToggle = () => {}, onActiveState }) => {
  const location = useLocation();

  const handleToggle = (event) => {
    onToggle(navItem, event);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle(event);
    }
  };

  const isActive = navItem.hasLink() && location.pathname === navItem.linkTo;

  // Reporting the active item can set state in the parent, so it can't happen
  // while this item renders. Keyed on the item's key, not the object: a parent
  // that builds its items inline hands over new objects on every render, and
  // reporting each one would re-render the parent in a loop.
  useEffect(() => {
    if (onActiveState && isActive) onActiveState(navItem);
  }, [isActive, navItem.key]);

  let cls = ClassNames({
    'component-navbar-item': true,
    'has-link': navItem.hasLink(),
    'has-children': navItem.hasChildren(),
    'is-active': isActive
  });

  cls += navLevel ? ` navlevel-indent-${navLevel}` : ' navlevel-indent-0';

  if (navItem.extraClass) {
    cls += ` ${navItem.extraClass}`;
  }

  if (navItem.isExpanded()) {
    cls += ' is-expanded';
  }

  if (navItem.hasLink()) {
    return (
      <div className={cls}>
        <Link to={toRoute(navItem)} className="navTitle">{navItem.title}</Link>
      </div>
    );
  }

  if (navItem.hasChildren()) {
    return (
      <div
        className={`${cls} toggle-expand`}
        role="button"
        tabIndex={0}
        aria-expanded={navItem.isExpanded()}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <span aria-hidden="true">{navItem.isExpanded() ? String.fromCharCode(0x25be) : String.fromCharCode(0x25b8)}</span>
        <span className="navTitle">{navItem.title}</span>
      </div>
    );
  }

  return (
    <div className={`${cls} navTitle`}>
      {navItem.title}
    </div>
  );
};

NavBarItem.propTypes = {
  navItem: PropTypes.object.isRequired,
  navLevel: PropTypes.number,
  onToggle: PropTypes.func,
  onActiveState: PropTypes.func,
};

export default NavBarItem;
