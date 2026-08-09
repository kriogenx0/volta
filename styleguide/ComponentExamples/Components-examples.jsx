import React, { useState } from 'react';
import _ from 'lodash';

import components from './components';

import ComponentExample from "./ComponentExample";
import "./Components-examples.scss";

const ComponentExamples = () => {
  const [selectedComponentKey, selectComponentKey] = useState(0);
  const selectedComponent = components[selectedComponentKey];

  const handleComponentClick = (key) => { selectComponentKey(key) };

  // Split view
  return (
    <div className="v-component_examples">
      <div className="component_examples-list">
        {_.map(components, (component, i) => {
          return (
            <div key={i} className={"clickable" + (selectedComponentKey == i ? ' pressed' : '')} onClick={handleComponentClick.bind(this, i)}>
              {component.name}
            </div>
          );
        })}
      </div>
      <div className="component_examples-detail">
        <ComponentExample component={selectedComponent} />
      </div>
    </div>
  );

  /*
  return (
    <div className="v-component_examples">
      {_.map(components, (component, i) => {
        <ComponentExample component={component} />
      })}
    </div>
  );
  */
};

export default ComponentExamples;
