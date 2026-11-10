import { render, screen, fireEvent } from '@testing-library/react';

import List, { ListCard, ListCardRow, ListRow } from '../../components/List';

describe('ListCard (List with card)', () => {
  it('renders without crashing', () => {
    const { container } = render(<ListCard />);
    expect(container).toBeInTheDocument();
  });

  it('renders clickable rows as buttons', () => {
    const onClick = jest.fn();
    render(<ListCard><ListCardRow onClick={onClick}>Open</ListCardRow></ListCard>);
    const row = screen.getByRole('button', { name: 'Open' });
    expect(row.closest('li')).toHaveClass('lst_row');
    fireEvent.click(row);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders static rows without the hover action', () => {
    render(<ListCard><ListCardRow as="div">Info</ListCardRow></ListCard>);
    expect(screen.getByText('Info').tagName).toBe('DIV');
    expect(screen.getByText('Info').closest('li')).toHaveClass('lst_row');
  });
});

describe('ListCard rows (ListRow)', () => {
  it('wraps its rows in the card', () => {
    const { container } = render(<ListCard><ListCardRow as="div">One</ListCardRow><ListCardRow as="div">Two</ListCardRow></ListCard>);
    const card = container.querySelector('ul.volta-list.volta-list--card');
    expect(card.children).toHaveLength(2);
    expect([...card.children].every((child) => child.tagName === 'LI')).toBe(true);
  });

  it('defaults to a clickable button row even without an onClick', () => {
    render(<ListCard><ListCardRow>Row</ListCardRow></ListCard>);
    expect(screen.getByRole('button', { name: 'Row' })).toBeInTheDocument();
    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Row' }))).not.toThrow();
  });

  it('keeps a custom className on the row', () => {
    render(<ListCard><ListCardRow className="extra">Row</ListCardRow></ListCard>);
    expect(screen.getByRole('button', { name: 'Row' }).closest('li')).toHaveClass('lst_row', 'extra');
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

  it('ListCard is a List with card, and ListCardRow is a ListRow', () => {
    const { container, rerender } = render(<ListCard><ListCardRow as="div">One</ListCardRow></ListCard>);
    expect(container.firstChild).toHaveClass('volta-list', 'volta-list--card');
    rerender(<List card><ListRow as="div">One</ListRow></List>);
    expect(container.firstChild).toHaveClass('volta-list', 'volta-list--card');
    expect(container.querySelector('li.lst_row')).toBeInTheDocument();
  });

  it('draws items as a card too, with the card class and the same rows', () => {
    const { container } = render(<List card items={[{ label: 'One' }, { label: 'Two', action: () => {} }]} />);
    expect(container.firstChild).toHaveClass('volta-list--card');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Two' })).toBeInTheDocument();
  });

  it('is a plain list without card, and renders nothing with neither items nor rows', () => {
    const { container, rerender } = render(<List items={[{ label: 'One' }]} />);
    expect(container.firstChild).not.toHaveClass('volta-list--card');
    rerender(<List />);
    expect(container).toBeEmptyDOMElement();
  });

  it('adds its className to the list', () => {
    const { container } = render(<List card className="extra" items={[{ label: 'One' }]} />);
    expect(container.firstChild).toHaveClass('volta-list', 'volta-list--card', 'extra');
  });
});
