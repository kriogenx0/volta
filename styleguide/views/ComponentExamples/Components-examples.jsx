import React, { useState } from 'react';
import _ from 'lodash';

import components from './components';
import componentGroups from './componentGroups';

import ComponentExample from "./ComponentExample";
import "./Components-examples.scss";

const componentsByName = _.keyBy(components, 'name');

const ComponentExamples = () => {
  const [selectedName, selectName] = useState(components[0].name);
  const selectedComponent = componentsByName[selectedName];

  // The sidebar stays in view while the page is scrolled, so a new component
  // would otherwise open partway down.
  const handleComponentClick = (name) => {
    selectName(name);
    window.scrollTo(0, 0);
  };

  // Split view
  return (
    <div className="view-components">
      <div className="component_examples-list">
        {componentGroups.map((group) => (
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
