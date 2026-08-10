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

  const handleComponentClick = (name) => { selectName(name) };

  // Split view
  return (
    <div className="v-component_examples">
      <div className="component_examples-list">
        {componentGroups.map((group) => (
          <div className="component_examples-group" key={group.label}>
            <div className="component_examples-group_label">{group.label}</div>
            {group.components.map((name) => {
              const component = componentsByName[name];
              if (!component) return null;
              return (
                <div
                  key={name}
                  className={"clickable" + (selectedName === name ? ' pressed' : '')}
                  onClick={handleComponentClick.bind(this, name)}
                >
                  {component.name}
                </div>
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

