import React, { useState } from 'react';

import TextBox from '../../../components/TextBox/TextBox';

import components from './components';
import componentGroups from './componentGroups';

import ComponentExample from "./ComponentExample";
import "./Components-examples.scss";

const componentsByName = Object.fromEntries(components.map((component) => [component.name, component]));

// The groups with only the components whose name contains the text typed, and no
// group left empty. An empty search keeps everything.
const filterGroups = (query) => {
  const needle = query.trim().toLowerCase();
  return componentGroups
    .map((group) => ({ ...group, components: group.components.filter((name) => componentsByName[name] && name.toLowerCase().includes(needle)) }))
    .filter((group) => group.components.length > 0);
};

const ComponentExamples = () => {
  const [selectedName, selectName] = useState(components[0].name);
  const [query, setQuery] = useState('');
  const selectedComponent = componentsByName[selectedName];
  const groups = filterGroups(query);

  // The sidebar stays in view while the page is scrolled, so a new component
  // would otherwise open partway down.
  const handleComponentClick = (name) => {
    selectName(name);
    window.scrollTo(0, 0);
  };

  // Enter opens the first match; Escape clears the search
  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter' && groups.length) {
      event.preventDefault();
      handleComponentClick(groups[0].components[0]);
    } else if (event.key === 'Escape' && query) {
      event.preventDefault();
      setQuery('');
    }
  };

  // Split view
  return (
    <div className="view-components">
      <div className="component_examples-list">
        <div className="component_examples-search">
          <TextBox
            type="search"
            aria-label="Search components"
            placeholder="Search components"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        {groups.length === 0 && (
          <p className="component_examples-empty" role="status">No components match &ldquo;{query.trim()}&rdquo;</p>
        )}
        {groups.map((group) => (
          <div className="component_examples-group" key={group.label}>
            <div className="component_examples-group_label">{group.label}</div>
            {group.components.map((name) => {
              const component = componentsByName[name];
              if (!component) return null;
              return (
                <button
                  type="button"
                  key={name}
                  className={"clickable" + (selectedName === name ? ' pressed' : '')}
                  onClick={() => handleComponentClick(name)}
                >
                  {component.name}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="component_examples-detail">
        <ComponentExample component={selectedComponent} />
      </div>
    </div>
  );
};

export default ComponentExamples;
