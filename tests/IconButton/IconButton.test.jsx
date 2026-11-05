import { render, screen, fireEvent } from '@testing-library/react';

import IconButton from '../../components/IconButton/IconButton';

const StubIcon = () => <svg />;
const SizedIcon = ({ size }) => <svg data-testid="icon" width={size} height={size} />;

describe('IconButton', () => {
  it('renders without crashing', () => {
    const { container } = render(<IconButton icon={StubIcon} label="Close" />);
    expect(container).toBeInTheDocument();
  });

  it('is labelled for assistive tech and defaults to the ghost variant', () => {
    render(<IconButton icon={StubIcon} label="Close" />);
    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass('volta-icon_button--ghost');
  });

  it('supports the danger variant and click handling', () => {
    const onClick = jest.fn();
    render(<IconButton icon={StubIcon} label="Delete" variant="danger" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass('volta-icon_button--danger');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('lists its variants', () => {
    expect(IconButton.variants).toEqual(['ghost', 'danger']);
  });

  it('also shows the label as a tooltip', () => {
    render(<IconButton icon={StubIcon} label="Edit" />);
    expect(screen.getByRole('button', { name: 'Edit' })).toHaveAttribute('title', 'Edit');
  });

  it('renders the icon component at 16px by default and at the given size', () => {
    const { rerender } = render(<IconButton icon={SizedIcon} label="Add" />);
    expect(screen.getByTestId('icon')).toHaveAttribute('width', '16');

    rerender(<IconButton icon={SizedIcon} label="Add" size={24} />);
    expect(screen.getByTestId('icon')).toHaveAttribute('width', '24');
  });

  it('is a non-submitting button unless told otherwise', () => {
    const { rerender } = render(<IconButton icon={StubIcon} label="Go" />);
    expect(screen.getByRole('button', { name: 'Go' })).toHaveAttribute('type', 'button');

    rerender(<IconButton icon={StubIcon} label="Go" type="submit" />);
    expect(screen.getByRole('button', { name: 'Go' })).toHaveAttribute('type', 'submit');
  });

  it('appends a custom className', () => {
    render(<IconButton icon={StubIcon} label="Go" className="extra" />);
    const button = screen.getByRole('button', { name: 'Go' });
    expect(button).toHaveClass('volta-icon_button', 'extra');
  });

  it('does not fire onClick when disabled', () => {
    const onClick = jest.fn();
    render(<IconButton icon={StubIcon} label="Go" disabled onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Go' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
