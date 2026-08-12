import { render } from '@testing-library/react';

import ListCard, { ListCardRow } from '../../components/ListCard/ListCard';

describe('ListCard', () => {
  it('renders without crashing', () => {
    const { container } = render(<ListCard />);
    expect(container).toBeInTheDocument();
  });
});
