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
});
