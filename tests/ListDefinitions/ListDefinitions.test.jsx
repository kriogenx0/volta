import { render } from '@testing-library/react';

import ListDefinitions from '../../components/ListDefinitions/ListDefinitions';

describe('ListDefinitions', () => {
  it('renders without crashing', () => {
    const { container } = render(<ListDefinitions />);
    expect(container).toBeInTheDocument();
  });
});
