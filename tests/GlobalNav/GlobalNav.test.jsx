import { render } from '@testing-library/react';

import GlobalNav from '../../components/GlobalNav/GlobalNav';

describe('GlobalNav', () => {
  it('renders without crashing', () => {
    const { container } = render(<GlobalNav />);
    expect(container).toBeInTheDocument();
  });
});
