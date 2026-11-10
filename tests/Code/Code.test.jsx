import { jsx } from 'react/jsx-runtime';
import { render, screen } from '@testing-library/react';

import Code from '../../components/Code/Code';

// Expose the props Code hands to the highlighter so defaults can be asserted.
jest.mock('react-syntax-highlighter', () => {
  const React = require('react');
  const SyntaxHighlighter = ({ children, language, style }) => React.createElement(
    'pre',
    { 'data-testid': 'highlighter', 'data-language': language, 'data-theme': style && style.name },
    children
  );
  SyntaxHighlighter.registerLanguage = () => {};
  return { PrismLight: SyntaxHighlighter };
});
jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  oneDark: { name: 'dark' },
  oneLight: { name: 'light' }
}));

describe('Code', () => {
  it('renders a code block with syntax highlighting', () => {
    render(<Code language="jsx">{'const x = 1;'}</Code>);
    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
  });

  it('renders as an inline <code> element when inline is set', () => {
    const { container } = render(<Code inline>npm install</Code>);
    const el = container.querySelector('code.volta-code-inline');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('npm install');
    // Inline code takes its look from the global code style, not the block's
    expect(el).not.toHaveClass('volta-code');
  });

  it('applies a custom className', () => {
    const { container } = render(<Code inline className="extra">x</Code>);
    expect(container.querySelector('code')).toHaveClass('extra');
  });
});

// Vite compiles with the automatic JSX runtime (jsx()), where React 19 ignores
// defaultProps on function components. Jest's classic runtime still applies them,
// so these render through jsx() to prove the defaults come from default parameters.
describe('Code with the automatic JSX runtime', () => {
  it('defaults to the jsx language and dark theme as a block', () => {
    const { container } = render(jsx(Code, { children: 'const x = 1;' }));
    const highlighter = screen.getByTestId('highlighter');
    expect(highlighter).toHaveAttribute('data-language', 'jsx');
    expect(highlighter).toHaveAttribute('data-theme', 'dark');
    expect(container.querySelector('.volta-code-inline')).not.toBeInTheDocument();
  });

  it('lets props override the defaults', () => {
    render(jsx(Code, { children: 'echo hi', language: 'bash', theme: 'light' }));
    const highlighter = screen.getByTestId('highlighter');
    expect(highlighter).toHaveAttribute('data-language', 'bash');
    expect(highlighter).toHaveAttribute('data-theme', 'light');
  });
});
