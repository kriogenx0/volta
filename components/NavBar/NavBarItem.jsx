import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import _ from 'lodash';

const toRoute = (navItem) => ({
  pathname: navItem.linkTo,
  search: navItem.query ? `?${new URLSearchParams(navItem.query).toString()}` : ''
});

const NavBarItem = ({ navItem, navLevel, onToggle, onActiveState }) => {
  const location = useLocation();

  const handleToggle = (event) => {
    onToggle(navItem, event);
  };

  const isActive = navItem.hasLink() && location.pathname === navItem.linkTo;

  if (onActiveState && isActive) {
    onActiveState(navItem);
  }

  let cls = ClassNames({
    'component-navbar-item': true,
    'has-link': navItem.hasLink(),
    'has-children': navItem.hasChildren(),
    'is-active': isActive
  });

  cls += navLevel ? ` navlevel-indent-${navLevel}` : ' navlevel-indent-0';

  if (_.isPresent(navItem.extraClass)) {
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
      <div className={`${cls} toggle-expand`} onClick={handleToggle}>
        <span>{navItem.isExpanded() ? String.fromCharCode(0x25be) : String.fromCharCode(0x25b8)}</span>
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

NavBarItem.defaultProps = {
  onToggle: () => {}
};

NavBarItem.propTypes = {
  onToggle: PropTypes.func,
  onActiveState: PropTypes.func,
};

export default NavBarItem;
