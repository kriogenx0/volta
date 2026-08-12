import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// jsdom doesn't implement TextEncoder/TextDecoder, which react-router-dom
// requires at import time.
global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;

// A handful of legacy components reference React/PropTypes/lodash as
// globals rather than importing them (see webpack.config.js's
// ProvidePlugin for the production build). Mirror that here so the same
// components are testable without editing every call site.
global.React = require('react');
global.PropTypes = require('prop-types');
global._ = require('lodash');
