import { fireEvent, render, screen } from '@testing-library/react';

import NativeColorPicker from '../../components/NativeColorPicker/NativeColorPicker';

describe('NativeColorPicker', () => {
  it('is a named colour input showing the value', () => {
    render(<NativeColorPicker value="#4a90e2" />);
    const input = screen.getByLabelText('Choose color');
    expect(input).toHaveAttribute('type', 'color');
    expect(input).toHaveValue('#4a90e2');
  });

  it('reports the chosen colour', () => {
    const onChange = jest.fn();
    render(<NativeColorPicker value="#000000" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Choose color'), { target: { value: '#f06060' } });
    expect(onChange).toHaveBeenCalledWith('#f06060');
  });

  it('passes other props to the input and can be disabled', () => {
    render(<NativeColorPicker aria-label="Brand" disabled name="brand" />);
    expect(screen.getByLabelText('Brand')).toBeDisabled();
  });

  it('takes its corners from the radius token, with the colour inside following the same curve', () => {
    const fs = require('fs');
    const path = require('path');
    const scss = fs.readFileSync(path.join(__dirname, '../../components/NativeColorPicker/NativeColorPicker.scss'), 'utf8');
    expect(scss).toMatch(/\.volta-native_color_picker \{[\s\S]*?border-radius:\s*var\(--v-radius-md\)/);
    expect(scss.match(/color-swatch \{[^}]*border-radius:\s*calc\(var\(--v-radius-md\) \* 0\.8\)/g)).toHaveLength(2);
    expect(scss).not.toMatch(/--v-radius-sm/);
  });
});
