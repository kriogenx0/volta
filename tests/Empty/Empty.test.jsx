import { render, screen } from '@testing-library/react';

import Empty, { EmptyState } from '../../components/Empty/Empty';

describe('Empty', () => {
  it('renders without crashing', () => {
    const { container } = render(<Empty />);
    expect(container).toBeInTheDocument();
  });

  it('renders the empty state message', () => {
    render(<EmptyState>Nothing here yet</EmptyState>);
    expect(screen.getByText('Nothing here yet')).toHaveClass('volta-empty_state-text');
    expect(screen.getByText('Nothing here yet').parentElement).toHaveClass('volta-empty_state');
  });
});
