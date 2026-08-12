import { render } from '@testing-library/react';

import Dropdown from '../../components/Dropdown/Dropdown';

describe('Dropdown', () => {
  it('renders without crashing', () => {
    const { container } = render(<Dropdown />);
    expect(container).toBeInTheDocument();
  });
});
