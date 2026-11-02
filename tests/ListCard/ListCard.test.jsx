import { render, screen, fireEvent } from '@testing-library/react';

import ListCard, { ListCardRow } from '../../components/ListCard/ListCard';

describe('ListCard', () => {
  it('renders without crashing', () => {
    const { container } = render(<ListCard />);
    expect(container).toBeInTheDocument();
  });

  it('renders clickable rows as buttons', () => {
    const onClick = jest.fn();
    render(<ListCard><ListCardRow onClick={onClick}>Open</ListCardRow></ListCard>);
    const row = screen.getByRole('button', { name: 'Open' });
    expect(row).toHaveClass('volta-list_card-row', 'volta-list_card-row--action');
    fireEvent.click(row);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders static rows without the hover action', () => {
    render(<ListCard><ListCardRow as="div">Info</ListCardRow></ListCard>);
    expect(screen.getByText('Info')).toHaveClass('volta-list_card-row');
    expect(screen.getByText('Info')).not.toHaveClass('volta-list_card-row--action');
  });
});
