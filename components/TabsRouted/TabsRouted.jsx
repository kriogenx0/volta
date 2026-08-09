import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './TabsRouted.scss';

const TabsRouted = ({ tabs }) => (
  <ul className='c-tabs_routed'>
    {_.map(tabs, (tab, i) => (
      <li key={i}>
        <Link to={tab.path} activeClassName='is-active'>{tab.name}</Link>
      </li>
    ))}
  </ul>
);

TabsRouted.propTypes = {
  // path, name
  tabs: PropTypes.array
};

export default TabsRouted;
