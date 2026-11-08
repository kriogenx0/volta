import { render, screen, fireEvent } from '@testing-library/react';

import ActionMenu from '../../components/ActionMenu/ActionMenu';

describe('ActionMenu', () => {
  it('renders without crashing', () => {
    const { container } = render(<ActionMenu />);
    expect(container).toBeInTheDocument();
  });

  it('names its icon-only button "Actions" unless told what the menu is for', () => {
    const { rerender } = render(<ActionMenu items={['Edit']} />);
    expect(screen.getByRole('button', { name: 'Actions' })).toBeInTheDocument();

    rerender(<ActionMenu items={['Edit']} aria-label="Row actions" />);
    expect(screen.getByRole('button', { name: 'Row actions' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Actions' })).toBeNull();
  });

  it('has a named button that reports whether the menu is open', () => {
    const { container } = render(<ActionMenu items={['Edit']} />);
    const button = screen.getByRole('button', { name: 'Actions' });
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(container.firstChild).not.toHaveClass('is-open');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(container.firstChild).toHaveClass('is-open');
  });

  it('lists string items and items with labels as menu items', () => {
    render(<ActionMenu items={['Edit', { label: 'Share' }]} />);
    const items = screen.getAllByRole('menuitem', { hidden: true });
    expect(items.map((item) => item.textContent)).toEqual(['Edit', 'Share']);
  });

  it('calls onToggle when it opens and closes', () => {
    const onToggle = jest.fn();
    render(<ActionMenu items={['Edit']} onToggle={onToggle} />);
    const button = screen.getByRole('button', { name: 'Actions' });

    fireEvent.click(button);
    expect(onToggle).toHaveBeenLastCalledWith(true);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onToggle).toHaveBeenLastCalledWith(false);
  });

  it('calls onSelect with the item and its index, runs its action and closes', () => {
    const action = jest.fn();
    const onSelect = jest.fn();
    const items = ['Edit', { label: 'Share', action }];
    const { container } = render(<ActionMenu items={items} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

    fireEvent.click(screen.getByRole('menuitem', { name: 'Share' }));
    expect(onSelect).toHaveBeenCalledWith(items[1], 1);
    expect(action).toHaveBeenCalledTimes(1);
    expect(container.firstChild).not.toHaveClass('is-open');
  });

  it('reports the close through onToggle when an item is chosen', () => {
    const onToggle = jest.fn();
    render(<ActionMenu items={['Edit', 'Share']} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(onToggle).toHaveBeenLastCalledWith(true);

    fireEvent.click(screen.getByRole('menuitem', { name: 'Share' }));
    expect(onToggle).toHaveBeenLastCalledWith(false);
    expect(onToggle).toHaveBeenCalledTimes(2);
  });

  it('can choose an item without an onSelect or an action', () => {
    const { container } = render(<ActionMenu items={['Edit']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

    fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(container.firstChild).not.toHaveClass('is-open');
  });

  it('chooses an item with the keyboard', () => {
    const onSelect = jest.fn();
    render(<ActionMenu items={['Edit']} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Edit' }), { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('Edit', 0);
  });

  it('closes on Escape and returns focus to its button', () => {
    const { container } = render(<ActionMenu items={['Edit']} />);
    const button = screen.getByRole('button', { name: 'Actions' });
    fireEvent.click(button);
    screen.getByRole('menuitem', { name: 'Edit' }).focus();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(container.firstChild).not.toHaveClass('is-open');
    expect(button).toHaveFocus();
  });

  it('closes when the overlay is clicked outside it', () => {
    const { container } = render(<ActionMenu items={['Edit']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

    fireEvent.click(document.querySelector('.volta-overlay'));
    expect(container.firstChild).not.toHaveClass('is-open');
  });
});
