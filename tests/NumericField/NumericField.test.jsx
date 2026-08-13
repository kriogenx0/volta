import { render, screen } from '@testing-library/react';

import NumericField from '../../components/NumericField/NumericField';

describe('NumericField', () => {
  it('renders without crashing', () => {
    const { container } = render(<NumericField />);
    expect(container).toBeInTheDocument();
  });

  it('uses a native number input and passes through its constraints', () => {
    render(<NumericField aria-label="Quantity" type="text" min={1} max={10} step={1} />);

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '10');
    expect(input).toHaveAttribute('step', '1');
  });
});
