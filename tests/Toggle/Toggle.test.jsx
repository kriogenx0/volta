import { render } from '@testing-library/react';

import Toggle from '../../components/Toggle/Toggle';

describe('Toggle', () => {
  it('renders without crashing', () => {
    const { container } = render(<Toggle />);
    expect(container).toBeInTheDocument();
  });
});
