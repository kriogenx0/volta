import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './TabBar.scss';
import { map } from '../../util/collection';

// A tab is a string, or an element carrying a `label` prop.
const tabLabel = (tab) => {
  if (typeof tab == 'string') return tab;
  if (React.isValidElement(tab)) return tab.props.label;
  return undefined;
};

const TabBar = ({ tabs, onChange, selectedTabIndex: selectedTabIndexProp }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(selectedTabIndexProp || 0);

  // A parent that changes selectedTabIndex moves the selection with it
  useEffect(() => {
    if (typeof selectedTabIndexProp == 'number') setSelectedTabIndex(selectedTabIndexProp);
  }, [selectedTabIndexProp]);

  const handleTabSelect = (index, label) => {
    setSelectedTabIndex(index);
    if (onChange) onChange(index, label);
  };

  return (
    <div className='volta-tab_bar'>
      {map(tabs, (tab, i) => {
        const label = tabLabel(tab);

        return (
          <TabBar.Link
            key={i}
            label={label}
            active={selectedTabIndex === i}
            onClick={() => handleTabSelect(i, label)}
          />
        );
      })}
    </div>
  );
};

TabBar.propTypes = {
  tabs: PropTypes.array, // strings, or elements with a `label` prop
  onChange: PropTypes.func, // (index, label)
  selectedTabIndex: PropTypes.number
};

const TabBarLink = ({ active, label, onClick }) => (
  <button
    type='button'
    className={`volta-tab_bar-link${active ? ' tab-active' : ''}`}
    aria-current={active ? 'true' : undefined}
    onClick={onClick}
  >
    {label}
  </button>
);

TabBarLink.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.node,
  onClick: PropTypes.func
};

TabBar.Link = TabBarLink;

export default TabBar;
