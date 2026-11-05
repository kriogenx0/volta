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

describe('ListCard rows', () => {
  it('wraps its rows in the card', () => {
    const { container } = render(<ListCard><ListCardRow as="div">One</ListCardRow><ListCardRow as="div">Two</ListCardRow></ListCard>);
    expect(container.querySelector('.volta-list_card').children).toHaveLength(2);
  });

  it('defaults to a clickable button row even without an onClick', () => {
    render(<ListCard><ListCardRow>Row</ListCardRow></ListCard>);
    expect(screen.getByRole('button', { name: 'Row' })).toBeInTheDocument();
    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Row' }))).not.toThrow();
  });

  it('keeps a custom className on the row', () => {
    render(<ListCard><ListCardRow className="extra">Row</ListCardRow></ListCard>);
    expect(screen.getByRole('button', { name: 'Row' })).toHaveClass('volta-list_card-row', 'extra');
  });

  it('does not submit an enclosing form when a row is clicked', () => {
    const onSubmit = jest.fn((e) => e.preventDefault());
    render(<form onSubmit={onSubmit}><ListCard><ListCardRow>Row</ListCardRow></ListCard></form>);
    fireEvent.click(screen.getByRole('button', { name: 'Row' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('has no button role on a static row', () => {
    render(<ListCard><ListCardRow as="div">Info</ListCardRow></ListCard>);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
