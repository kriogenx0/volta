import { render, screen, fireEvent } from '@testing-library/react';

import DropdownList from '../../components/DropdownList/DropdownList';

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' }
];

describe('DropdownList', () => {
  it('renders without crashing', () => {
    const { container } = render(<DropdownList />);
    expect(container).toBeInTheDocument();
  });

  it('shows the default placeholder on its button', () => {
    render(<DropdownList options={OPTIONS} />);
    expect(screen.getByRole('button', { name: 'Select an option' })).toBeInTheDocument();
  });

  it('shows a custom placeholder', () => {
    render(<DropdownList options={OPTIONS} placeholder="Pick a fruit" />);
    expect(screen.getByRole('button', { name: 'Pick a fruit' })).toBeInTheDocument();
  });

  it('lists its options as a listbox', () => {
    render(<DropdownList options={OPTIONS} />);
    expect(screen.getByRole('listbox', { hidden: true })).toBeInTheDocument();
    const options = screen.getAllByRole('option', { hidden: true });
    expect(options.map((option) => option.textContent)).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('opens when the button is clicked and reports it through onToggle', () => {
    const onToggle = jest.fn();
    const { container } = render(<DropdownList options={OPTIONS} onToggle={onToggle} />);
    expect(container.firstChild).not.toHaveClass('is-open');

    fireEvent.click(screen.getByRole('button', { name: 'Select an option' }));
    expect(container.firstChild).toHaveClass('is-open');
    expect(onToggle).toHaveBeenLastCalledWith(true);
  });

  it('calls onSelect with the option and its index, then closes', () => {
    const onSelect = jest.fn();
    const onToggle = jest.fn();
    const { container } = render(<DropdownList options={OPTIONS} onSelect={onSelect} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select an option' }));

    fireEvent.click(screen.getByRole('option', { name: 'Banana' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(OPTIONS[1], 1);
    expect(container.firstChild).not.toHaveClass('is-open');
    expect(onToggle).toHaveBeenLastCalledWith(false);
  });

  it('runs the action of the chosen option', () => {
    const action = jest.fn();
    render(<DropdownList options={[{ label: 'Run it', action }]} />);
    fireEvent.click(screen.getByRole('option', { name: 'Run it', hidden: true }));
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('selects an option with the keyboard', () => {
    const onSelect = jest.fn();
    render(<DropdownList options={OPTIONS} onSelect={onSelect} />);
    const option = screen.getByRole('option', { name: 'Cherry', hidden: true });
    expect(option).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(option, { key: 'Enter' });
    fireEvent.keyDown(option, { key: ' ' });
    fireEvent.keyDown(option, { key: 'a' });
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith(OPTIONS[2], 2);
  });

  describe('selectedOption', () => {
    it('replaces the placeholder on the button and marks the option', () => {
      render(<DropdownList options={OPTIONS} selectedOption={OPTIONS[1]} />);
      expect(screen.getByRole('button', { name: 'Banana' })).toBeInTheDocument();

      const selected = screen.getByRole('option', { name: 'Banana', hidden: true });
      expect(selected).toHaveAttribute('aria-selected', 'true');
      expect(selected).toHaveClass('dropdown_list_item-active');
      expect(screen.getByRole('option', { name: 'Apple', hidden: true })).toHaveAttribute('aria-selected', 'false');
    });

    it('keeps the placeholder when setPlaceholder is false', () => {
      render(<DropdownList options={OPTIONS} selectedOption={OPTIONS[1]} placeholder="Pick a fruit" setPlaceholder={false} />);
      expect(screen.getByRole('button', { name: 'Pick a fruit' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Banana', hidden: true })).toHaveClass('dropdown_list_item-active');
    });
  });

  it('says so when there are no options', () => {
    const { rerender } = render(<DropdownList options={[]} />);
    const none = screen.getByRole('option', { name: 'No options available.', hidden: true });
    expect(none).toHaveAttribute('aria-disabled', 'true');
    expect(none).not.toHaveAttribute('tabindex');

    rerender(<DropdownList />);
    expect(screen.getByText('No options available.')).toBeInTheDocument();
  });

  it('still accepts the deprecated items prop, with a warning', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<DropdownList items={OPTIONS} />);
    expect(screen.getAllByRole('option', { hidden: true })).toHaveLength(3);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("'items'"));
    warn.mockRestore();
  });

  describe('closing', () => {
    it('closes on Escape and returns focus to the button', () => {
      const { container } = render(<DropdownList options={OPTIONS} />);
      const button = screen.getByRole('button', { name: 'Select an option' });
      fireEvent.click(button);
      screen.getByRole('option', { name: 'Apple' }).focus();

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(container.firstChild).not.toHaveClass('is-open');
      expect(button).toHaveFocus();
    });

    it('closes when the overlay is clicked', () => {
      const { container } = render(<DropdownList options={OPTIONS} />);
      fireEvent.click(screen.getByRole('button', { name: 'Select an option' }));

      fireEvent.click(document.querySelector('.volta-overlay'));
      expect(container.firstChild).not.toHaveClass('is-open');
    });
  });

  describe('with open from the parent', () => {
    it('follows open and leaves the changing to the parent through onToggle', () => {
      const onToggle = jest.fn();
      const { container, rerender } = render(<DropdownList options={OPTIONS} open={false} onToggle={onToggle} />);

      fireEvent.click(screen.getByRole('button', { name: 'Select an option' }));
      expect(onToggle).toHaveBeenLastCalledWith(true);
      expect(container.firstChild).not.toHaveClass('is-open');

      rerender(<DropdownList options={OPTIONS} open onToggle={onToggle} />);
      expect(container.firstChild).toHaveClass('is-open');

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onToggle).toHaveBeenLastCalledWith(false);
      expect(container.firstChild).toHaveClass('is-open');
    });
  });

  it('uses buttonComponent for the trigger', () => {
    render(
      <DropdownList options={OPTIONS} open={false} buttonComponent={<button type="button">Fruit menu</button>} />
    );
    expect(screen.getByRole('button', { name: 'Fruit menu' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Select an option' })).toBeNull();
  });
});
