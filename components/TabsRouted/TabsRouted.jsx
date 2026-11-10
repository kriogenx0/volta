import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import './TabsRouted.scss';
import { map } from '../../util/collection';

const TabsRouted = ({ tabs }) => (
  <ul className='volta-tabs_routed'>
    {map(tabs, (tab, i) => (
      <li key={i}>
        {/* `end` so a "/" tab isn't active on every page */}
        <NavLink to={tab.path} end={tab.path === '/'} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
          {tab.name}
        </NavLink>
      </li>
    ))}
  </ul>
);

TabsRouted.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
    name: PropTypes.node.isRequired
  }))
};

export default TabsRouted;
