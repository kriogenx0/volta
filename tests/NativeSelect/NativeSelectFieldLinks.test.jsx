import { render, screen } from '@testing-library/react';

import NativeSelect from '../../components/NativeSelect/NativeSelect';

const OPTIONS = [{ value: 'a', label: 'Admin' }, { value: 'b', label: 'Member' }];

describe('Select label, hint and error', () => {
  it('links its label, hint and error to the select', () => {
    render(<NativeSelect options={OPTIONS} label="Role" hint="Who can do what" error="Pick one" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAccessibleName('Role');
    expect(select).toHaveAccessibleDescription('Who can do what Pick one');
    expect(select).toBeInvalid();
  });

  it('shows the error message and marks the select as in error', () => {
    const { container } = render(<NativeSelect options={OPTIONS} label="Role" error="Pick one" />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
    expect(container.querySelector('.volta-native_select')).toHaveClass('native_select-error');
  });

  it('is not invalid without an error', () => {
    const { container } = render(<NativeSelect options={OPTIONS} label="Role" hint="Who can do what" />);
    expect(screen.getByRole('combobox')).not.toBeInvalid();
    expect(container.querySelector('.volta-native_select')).not.toHaveClass('native_select-error');
  });

  it('shows a hint without a label', () => {
    render(<NativeSelect options={OPTIONS} aria-label="Role" hint="Who can do what" />);
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Who can do what');
  });

  it('keeps a description and an id the caller gave it', () => {
    render(<NativeSelect options={OPTIONS} id="mine" aria-label="Role" hint="Hint" aria-describedby="elsewhere" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('id', 'mine');
    expect(select.getAttribute('aria-describedby').split(' ')).toContain('elsewhere');
  });

  it('is still just the select without a label, hint or error', () => {
    const { container } = render(<NativeSelect options={OPTIONS} aria-label="Role" />);
    expect(container.firstChild).toHaveClass('volta-native_select');
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-describedby');
  });
});
