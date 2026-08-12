import React from 'react';

import Code from '../../../components/Code';

import ExampleErrorBoundary from './ExampleErrorBoundary';

const ComponentExample = ({ component }) => {
  if (!component || !component.name) return React.createElement(component);

  return (
    <section className="component-doc">
      <header className="component-doc-header">
        <h2>{component.name}</h2>
        {component.description && (
          <p className="component-doc-description">{component.description}</p>
        )}
      </header>

      <div className="component-examples">
        {(component.examples || []).map((example, i) => (
          <div className="style_guide-example" key={i}>
            <div className="example-header">
              <span className="example-name">{example.name}</span>
            </div>
            <div className="example-body">
              <div className="example-output">
                <ExampleErrorBoundary key={component.name}>
                  {example.output}
                </ExampleErrorBoundary>
              </div>
              <div className="example-code">
                <Code language="jsx">{example.code}</Code>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ComponentExample;

