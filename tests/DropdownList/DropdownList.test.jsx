import { render } from '@testing-library/react';

import DropdownList from '../../components/DropdownList/DropdownList';

describe('DropdownList', () => {
  it('renders without crashing', () => {
    const { container } = render(<DropdownList />);
    expect(container).toBeInTheDocument();
  });
});
