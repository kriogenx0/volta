import { render, screen } from '@testing-library/react';

import Radio from '../../components/Radio/Radio';

describe('Radio', () => {
  it('renders without crashing', () => {
    const { container } = render(<Radio />);
    expect(container).toBeInTheDocument();
  });

  it('retains native radio semantics and state', () => {
    render(<Radio name="plan" title="Pro" value="pro" defaultChecked />);

    const radio = screen.getByRole('radio', { name: 'Pro' });
    expect(radio).toBeChecked();
    expect(radio).toHaveAttribute('type', 'radio');
  });
});
