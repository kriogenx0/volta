import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
                <SyntaxHighlighter
                  language="jsx"
                  style={oneDark}
                  customStyle={{ margin: 0, borderRadius: '0 0 6px 6px', fontSize: '12px' }}
                >
                  {example.code}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ComponentExample;

