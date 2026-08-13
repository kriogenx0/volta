import { fireEvent, render, screen } from '@testing-library/react';

import ColorPicker from '../../components/ColorPicker/ColorPicker';

describe('ColorPicker', () => {
  it('renders without crashing', () => {
    const { container } = render(<ColorPicker />);
    expect(container).toBeInTheDocument();
  });

  it('commits native color and palette selections', () => {
    const onValueChange = jest.fn();
    render(<ColorPicker initialValue="#4a90e2" onValueChange={onValueChange} />);

    expect(screen.getByRole('textbox', { name: 'Hex color' })).toHaveValue('#4A90E2');

    fireEvent.change(screen.getByLabelText('Choose color'), { target: { value: '#f06060' } });
    expect(onValueChange).toHaveBeenLastCalledWith('#F06060');

    fireEvent.click(screen.getByRole('button', { name: 'Select #000000' }));
    expect(screen.getByRole('textbox', { name: 'Hex color' })).toHaveValue('#000000');
  });

  it('restores the current color when invalid hex text loses focus', () => {
    render(<ColorPicker initialValue="#4A90E2" />);
    const input = screen.getByRole('textbox', { name: 'Hex color' });

    fireEvent.change(input, { target: { value: 'not-a-color' } });
    fireEvent.blur(input);

    expect(input).toHaveValue('#4A90E2');
  });
});
