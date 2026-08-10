import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import './TabBar.scss';

const TabBar = ({ tabs, onChange, selectedTabIndex: selectedTabIndexProp }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(selectedTabIndexProp || 0);

  const handleTabSelect = (index, label) => {
    setSelectedTabIndex(index);
    if (onChange) onChange(index, label);
  };

  return (
    <div className='c-tab_bar'>
      {_.map(tabs, (tab, i) => {
        const tabProps = {
          key: i,
          active: selectedTabIndex === i
        };
        if (tab instanceof React.Component) {
          tabProps.label = tabComponent.props.label;
        }
        else if (typeof tab == 'string') {
          tabProps.label = tab;
        }

        return (
          <TabBar.Link {...tabProps} onClick={() => handleTabSelect(i, tabProps.label)} />
        );
      })}
    </div>
  );
};

TabBar.propTypes = {
  tabs: PropTypes.array,
  onChange: PropTypes.func,
  selectedTabIndex: PropTypes.number
};

TabBar.Link = ({ active, label, onClick }) => (
  <Link className={`c-tab_bar-link${active ? ' tab-active' : ''}`} key={label} activeClassName='tab-active' onClick={onClick}>{label}</Link>
);

export default TabBar;
