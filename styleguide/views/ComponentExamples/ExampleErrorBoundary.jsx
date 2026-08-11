import React from 'react';

export default class ExampleErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch() {
    // Swallow: the styleguide renders every component with no curated
    // examples using default props, so failures here are expected for
    // components that require specific data to render.
  }

  render() {
    if (this.state.error) {
      return (
        <div className="example-error">
          Couldn't render with default props: {this.state.error.message}
        </div>
      );
    }

    return this.props.children;
  }

}
