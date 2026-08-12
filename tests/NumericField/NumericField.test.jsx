import { render } from '@testing-library/react';

import NumericField from '../../components/NumericField/NumericField';

describe('NumericField', () => {
  it('renders without crashing', () => {
    const { container } = render(<NumericField />);
    expect(container).toBeInTheDocument();
  });
});
