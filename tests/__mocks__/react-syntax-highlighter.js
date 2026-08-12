// react-syntax-highlighter pulls in an ESM-only dependency chain
// (refractor/hastscript/etc.) that Jest can't transform. The real
// syntax highlighting isn't something tests need to verify -- a plain
// <pre><code> stand-in is enough to test that Code renders its content.
const React = require('react');

const SyntaxHighlighter = ({ children }) => React.createElement('pre', null, React.createElement('code', null, children));
SyntaxHighlighter.registerLanguage = () => {};

module.exports = { Prism: SyntaxHighlighter, PrismLight: SyntaxHighlighter, default: SyntaxHighlighter };
