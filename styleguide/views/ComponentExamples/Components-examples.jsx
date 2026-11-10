import React, { useState } from 'react';

import TextBox from '../../../components/TextBox/TextBox';
import SideBarList from '../../../components/SideBarList/SideBarList';

import components from './components';
import componentGroups from './componentGroups';

import ComponentExample from "./ComponentExample";
import ComponentOverview from "./ComponentOverview";
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
  // null is the overview of every component, which is where the page opens
  const [selectedName, selectName] = useState(null);
  const [query, setQuery] = useState('');
  const selectedComponent = componentsByName[selectedName];
  const groups = filterGroups(query);

  // The sidebar stays in view while the page is scrolled, so a new component
  // would otherwise open partway down. A null name is the overview.
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
      <SideBarList
        className="component_examples-list"
        ariaLabel="Components"
        groups={[
          { items: [{ value: null, label: 'All Components' }] },
          ...groups.map((group) => ({
            label: group.label,
            items: group.components.filter((name) => componentsByName[name]).map((name) => ({ value: name, label: componentsByName[name].name }))
          }))
        ]}
        value={selectedName}
        onSelect={handleComponentClick}
        emptyMessage={groups.length === 0 ? `No components match \u201c${query.trim()}\u201d` : undefined}
        header={(
          <TextBox
            type="search"
            aria-label="Search components"
            placeholder="Search components"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        )}
      />
      <div className="component_examples-detail">
        {selectedComponent
          ? <ComponentExample component={selectedComponent} />
          : <ComponentOverview groups={groups} componentsByName={componentsByName} onSelect={handleComponentClick} filtered={query.trim() !== ''} />}
      </div>
    </div>
  );
};

export default ComponentExamples;
