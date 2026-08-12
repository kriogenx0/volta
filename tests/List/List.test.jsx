import { render } from '@testing-library/react';

import List, { ListHeader, FilterSectionListItem } from '../../components/List';

describe('List', () => {
  it('renders without crashing', () => {
    const { container } = render(<List />);
    expect(container).toBeInTheDocument();
  });
});
