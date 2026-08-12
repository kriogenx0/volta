import { render } from '@testing-library/react';

import ActionMenu from '../../components/ActionMenu/ActionMenu';

describe('ActionMenu', () => {
  it('renders without crashing', () => {
    const { container } = render(<ActionMenu />);
    expect(container).toBeInTheDocument();
  });
});
