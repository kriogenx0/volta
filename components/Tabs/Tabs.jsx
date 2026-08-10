import PropTypes from 'prop-types';
import { map } from 'lodash';

import './Tabs.scss';

const Tabs = ({ tabs, selectedTabKey, onSelect, align }) => {

  const handleSelect = (tab, key) => {
    onSelect && onSelect(key, tab);
  };

  return (
    <div className={'v-tabs tab-align-' + align.toLowerCase()}>
      <nav>
        <ul>
          {map(tabs, (tab, key) => (
            <li
              key={tab}
              onClick={handleSelect.bind(null, tab, key)}
              className={'tab' + (key === selectedTabKey ? ' tab-selected' : '')}
            >
              {tab}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  selectedTabKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func,
  align: PropTypes.string,
  activeClassName: PropTypes.string
};

Tabs.defaultProps = {
  align: 'left',
  activeClassName: 'current'
};

export default Tabs;