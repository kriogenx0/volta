import { render, screen } from '@testing-library/react';

import Code from '../../components/Code/Code';

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
  });

  it('applies a custom className', () => {
    const { container } = render(<Code inline className="extra">x</Code>);
    expect(container.querySelector('code')).toHaveClass('extra');
  });
});
