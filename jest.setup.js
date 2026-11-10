import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// jsdom doesn't implement TextEncoder/TextDecoder, which react-router-dom
// requires at import time.
global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;

// A handful of legacy components reference React/PropTypes as
// globals rather than importing them (see webpack.config.js's
// ProvidePlugin for the production build). Mirror that here so the same
// components are testable without editing every call site.
global.React = require('react');
global.PropTypes = require('prop-types');

// Browser APIs jsdom doesn't implement. Components and styleguide examples use
// them, so stub them (only when missing) instead of failing on the environment.
if (!URL.createObjectURL) URL.createObjectURL = () => 'blob:jsdom';
if (!URL.revokeObjectURL) URL.revokeObjectURL = () => {};

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  });
}

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
if (!window.ResizeObserver) window.ResizeObserver = NoopObserver;
if (!window.IntersectionObserver) window.IntersectionObserver = NoopObserver;

window.scrollTo = () => {};
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || (() => {});

// jsdom logs "not implemented" for media playback.
window.HTMLMediaElement.prototype.load = () => {};
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};

// jsdom has no canvas drawing. Give canvases a context that accepts pixel data and
// drawing calls and shows nothing; a test that needs to see the calls spies on getContext.
HTMLCanvasElement.prototype.getContext = function getContext() {
  return {
    canvas: this,
    createImageData: (width, height) => ({ width, height, data: new Uint8ClampedArray(width * height * 4) }),
    putImageData() {},
    clearRect() {},
    fillRect() {},
    drawImage() {}
  };
};
