import { render, screen } from '@testing-library/react';

import ComponentExample from '../../styleguide/views/ComponentExamples/ComponentExample';

const component = {
  name: 'Thing',
  description: 'A thing.',
  examples: [
    { name: 'With code', code: '<Thing />', output: <button type="button">Live thing</button> },
    { name: 'No code', output: <span>Output only</span> }
  ]
};

describe('ComponentExample', () => {
  it('shows each example live next to its code', () => {
    const { container } = render(<ComponentExample component={component} />);
    const [withCode] = container.querySelectorAll('.example-body');
    expect(withCode).not.toHaveClass('example-body--output_only');
    expect(withCode.firstChild).toHaveClass('example-output');
    expect(withCode.lastChild).toHaveClass('example-code');
    expect(screen.getByText('Live thing')).toBeInTheDocument();
  });

  it('labels the code panel and makes it keyboard-focusable', () => {
    render(<ComponentExample component={component} />);
    const panel = screen.getByRole('region', { name: 'Code for With code' });
    expect(panel).toHaveAttribute('tabindex', '0');
    expect(panel).toHaveTextContent('<Thing />');
  });

  it('shows only the output, with no empty code panel, when an example has no code', () => {
    const { container } = render(<ComponentExample component={component} />);
    const [, noCode] = container.querySelectorAll('.example-body');
    expect(noCode).toHaveClass('example-body--output_only');
    expect(noCode.querySelector('.example-code')).toBeNull();
    expect(screen.queryByRole('region', { name: 'Code for No code' })).toBeNull();
  });
});
