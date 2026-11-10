import { render, screen, fireEvent } from '@testing-library/react';

import SideBarList from '../../components/SideBarList/SideBarList';

const groups = [
  { items: [{ value: null, label: 'All' }] },
  { label: 'Inputs', items: ['TextBox', 'ComboBox'] }
];

describe('SideBarList', () => {
  it('is a named navigation with a heading per labelled group', () => {
    render(<SideBarList ariaLabel="Components" groups={groups} />);
    expect(screen.getByRole('navigation', { name: 'Components' })).toBeInTheDocument();
    expect(screen.getByText('Inputs')).toBeInTheDocument();
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['All', 'TextBox', 'ComboBox']);
  });

  it('marks the item whose value is current, including a null value', () => {
    const { rerender } = render(<SideBarList groups={groups} value={null} />);
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-current', 'page');
    rerender(<SideBarList groups={groups} value="ComboBox" />);
    expect(screen.getByRole('button', { name: 'ComboBox' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'All' })).not.toHaveAttribute('aria-current');
  });

  it('calls onSelect with the value of the chosen item', () => {
    const onSelect = jest.fn();
    render(<SideBarList groups={groups} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'TextBox' }));
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(onSelect.mock.calls).toEqual([['TextBox'], [null]]);
  });

  it('shows the header and the empty message', () => {
    render(<SideBarList groups={[]} header={<input aria-label="Filter" />} emptyMessage="Nothing here" />);
    expect(screen.getByLabelText('Filter')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Nothing here');
  });

  it('lists each group as a list, named by its heading', () => {
    render(<SideBarList groups={groups} />);
    expect(screen.getByRole('list', { name: 'Inputs' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders an item with an href as a link, and a plain click selects it without leaving the page', () => {
    const onSelect = jest.fn();
    render(<SideBarList groups={[{ items: [{ value: 'a', label: 'Alpha', href: '/alpha' }] }]} onSelect={onSelect} />);
    const link = screen.getByRole('link', { name: 'Alpha' });
    expect(link).toHaveAttribute('href', '/alpha');
    expect(fireEvent.click(link)).toBe(false); // default prevented
    expect(onSelect).toHaveBeenCalledWith('a');
    expect(fireEvent.click(link, { ctrlKey: true })).toBe(true); // left to the browser
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
