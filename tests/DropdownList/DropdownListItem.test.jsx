import { render, screen, fireEvent } from '@testing-library/react';

import DropdownListItem from '../../components/DropdownList/DropdownListItem';

describe('DropdownListItem', () => {
  it('shows its label as a menu item', () => {
    render(<DropdownListItem label="Rename" onSelect={() => {}} />);
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeInTheDocument();
  });

  it('calls onSelect on click, Enter and Space', () => {
    const onSelect = jest.fn();
    render(<DropdownListItem label="Rename" onSelect={onSelect} />);
    const item = screen.getByRole('menuitem');

    fireEvent.click(item);
    fireEvent.keyDown(item, { key: 'Enter' });
    fireEvent.keyDown(item, { key: ' ' });
    fireEvent.keyDown(item, { key: 'Tab' });
    expect(onSelect).toHaveBeenCalledTimes(3);
  });

  it('is focusable only when it can be chosen', () => {
    const { rerender } = render(<DropdownListItem label="Rename" onSelect={() => {}} />);
    expect(screen.getByRole('menuitem')).toHaveAttribute('tabindex', '0');

    rerender(<DropdownListItem label="Rename" />);
    expect(screen.getByRole('menuitem')).not.toHaveAttribute('tabindex');
  });

  it('does not call onSelect when disabled', () => {
    const onSelect = jest.fn();
    render(<DropdownListItem label="Rename" onSelect={onSelect} disabled />);
    const item = screen.getByRole('menuitem');

    fireEvent.click(item);
    expect(onSelect).not.toHaveBeenCalled();
    expect(item).toHaveAttribute('aria-disabled', 'true');
    expect(item).toHaveClass('dropdown_list_item-disabled');
    expect(item).not.toHaveAttribute('tabindex');
  });

  it('marks the active option with aria-selected when it has the option role', () => {
    render(<DropdownListItem label="Apple" role="option" isActive />);
    const option = screen.getByRole('option', { name: 'Apple' });
    expect(option).toHaveAttribute('aria-selected', 'true');
    expect(option).toHaveClass('dropdown_list_item-active');
  });

  it('does not set aria-selected on a menu item', () => {
    render(<DropdownListItem label="Rename" isActive onSelect={() => {}} />);
    expect(screen.getByRole('menuitem')).not.toHaveAttribute('aria-selected');
  });
});
