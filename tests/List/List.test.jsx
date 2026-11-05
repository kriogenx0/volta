import { render, screen, fireEvent } from '@testing-library/react';

import List, { ListHeader, FilterSectionListItem } from '../../components/List';

describe('List', () => {
  it('renders without crashing', () => {
    const { container } = render(<List />);
    expect(container).toBeInTheDocument();
  });

  it('renders nothing without items', () => {
    const { container } = render(<List />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders one row per item', () => {
    render(<List items={[{ label: 'One' }, { label: 'Two' }]} />);
    expect(screen.getAllByRole('listitem').map((row) => row.textContent)).toEqual(['One', 'Two']);
  });

  it('renders an item without an action as plain text', () => {
    render(<List items={[{ label: 'Static' }]} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('Static')).toBeInTheDocument();
  });

  it('renders an item with an action as a button that gets (index, item, event)', () => {
    const action = jest.fn();
    const item = { label: 'Open', action };
    render(<List items={[{ label: 'Skip' }, item]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(action).toHaveBeenCalledTimes(1);
    expect(action.mock.calls[0][0]).toBe(1);
    expect(action.mock.calls[0][1]).toBe(item);
    expect(action.mock.calls[0][2]).toBeDefined();
  });

  it('does not submit an enclosing form when an action button is clicked', () => {
    const onSubmit = jest.fn((e) => e.preventDefault());
    render(<form onSubmit={onSubmit}><List items={[{ label: 'Go', action: () => {} }]} /></form>);
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe('ListHeader', () => {
  it('renders its title as a heading row', () => {
    render(<ul><ListHeader title="Status" /></ul>);
    expect(screen.getByRole('heading', { name: 'Status' })).toBeInTheDocument();
  });
});

describe('FilterSectionListItem', () => {
  it('calls onChange with its value and stops the link navigating', () => {
    const onChange = jest.fn();
    render(<ul><FilterSectionListItem name="Open" value="open" onChange={onChange} /></ul>);
    const notPrevented = fireEvent.click(screen.getByRole('link', { name: 'Open' }));
    expect(onChange).toHaveBeenCalledWith('open');
    expect(notPrevented).toBe(false);
  });

  it('marks the selected row for styling and assistive tech', () => {
    render(
      <ul>
        <FilterSectionListItem name="Open" value="open" selected />
        <FilterSectionListItem name="Closed" value="closed" />
      </ul>
    );
    expect(screen.getByRole('link', { name: 'Open' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'Open' }).parentElement).toHaveClass('is-selected');
    expect(screen.getByRole('link', { name: 'Closed' })).not.toHaveAttribute('aria-current');
  });

  it('does not throw when there is no onChange', () => {
    render(<ul><FilterSectionListItem name="Open" value="open" /></ul>);
    expect(() => fireEvent.click(screen.getByRole('link', { name: 'Open' }))).not.toThrow();
  });
});
