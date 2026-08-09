import '@testing-library/jest-dom';

// A handful of legacy components reference React/PropTypes/lodash as
// globals rather than importing them (see webpack.config.js's
// ProvidePlugin for the production build). Mirror that here so the same
// components are testable without editing every call site.
global.React = require('react');
global.PropTypes = require('prop-types');
global._ = require('lodash');
