import { render } from '@testing-library/react';

import Badge from '../../components/Badge/Badge';

describe('Badge', () => {
  it('renders without crashing', () => {
    const { container } = render(<Badge />);
    expect(container).toBeInTheDocument();
  });
});
