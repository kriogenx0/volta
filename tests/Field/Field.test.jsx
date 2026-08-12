import { render } from '@testing-library/react';

import Field from '../../components/Field/Field';

describe('Field', () => {
  it('renders without crashing', () => {
    const { container } = render(<Field />);
    expect(container).toBeInTheDocument();
  });
});
