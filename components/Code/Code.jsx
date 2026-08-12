import PropTypes from 'prop-types';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

import './Code.scss';

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);

const THEMES = { dark: oneDark, light: oneLight };

const Code = ({ children, language, theme, inline, className, ...otherProps }) => {
  const code = typeof children === 'string' ? children.trim() : children;

  if (inline) {
    return (
      <code className={['volta-code', 'volta-code-inline', className].filter(Boolean).join(' ')} {...otherProps}>
        {code}
      </code>
    );
  }

  return (
    <div className={['volta-code', className].filter(Boolean).join(' ')} {...otherProps}>
      <SyntaxHighlighter
        language={language}
        style={THEMES[theme] || THEMES.dark}
        customStyle={{ margin: 0 }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

Code.themes = ['dark', 'light'];

Code.propTypes = {
  children: PropTypes.node,
  language: PropTypes.string,
  theme: PropTypes.oneOf(Code.themes),
  inline: PropTypes.bool,
  className: PropTypes.string
};

Code.defaultProps = {
  language: 'jsx',
  theme: 'dark',
  inline: false
};

export { Code };
export default Code;
