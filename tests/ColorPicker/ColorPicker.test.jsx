import { useState } from 'react';
import { jsx } from 'react/jsx-runtime';
import { fireEvent, render, screen } from '@testing-library/react';

import ColorPicker from '../../components/ColorPicker/ColorPicker';
import ColorPickerPalette from '../../components/ColorPicker/color-picker-palette';
import ColorPickerSlider from '../../components/ColorPicker/color-picker-slider';
import ColorPickerSquare from '../../components/ColorPicker/color-picker-square';

const hexBox = () => screen.getByRole('textbox', { name: 'Hex color' });

describe('ColorPicker', () => {
  it('renders without crashing', () => {
    const { container } = render(<ColorPicker />);
    expect(container).toBeInTheDocument();
  });

  it('starts white with no props', () => {
    render(<ColorPicker />);
    expect(hexBox()).toHaveValue('#FFFFFF');
  });

  it('commits native color and palette selections', () => {
    const onValueChange = jest.fn();
    render(<ColorPicker initialValue="#4a90e2" onValueChange={onValueChange} />);

    expect(hexBox()).toHaveValue('#4A90E2');

    fireEvent.change(screen.getByLabelText('Choose color'), { target: { value: '#f06060' } });
    expect(onValueChange).toHaveBeenLastCalledWith('#F06060');

    fireEvent.click(screen.getByRole('button', { name: 'Select #000000' }));
    expect(hexBox()).toHaveValue('#000000');
  });

  it('restores the current color when invalid hex text loses focus', () => {
    render(<ColorPicker initialValue="#4A90E2" />);
    const input = hexBox();

    fireEvent.change(input, { target: { value: 'not-a-color' } });
    fireEvent.blur(input);

    expect(input).toHaveValue('#4A90E2');
  });

  it('does not report a color while the typed text is not one yet', () => {
    const onChange = jest.fn();
    render(<ColorPicker initialValue="#4A90E2" onChange={onChange} />);
    fireEvent.change(hexBox(), { target: { value: '#12' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('leaves typed text alone so a 3-digit prefix does not block a 6-digit hex', () => {
    const onChange = jest.fn();
    render(<ColorPicker initialValue="#4A90E2" onChange={onChange} />);
    const input = hexBox();

    fireEvent.change(input, { target: { value: '#123' } });
    expect(onChange).toHaveBeenLastCalledWith('#112233');
    expect(input).toHaveValue('#123');

    fireEvent.change(input, { target: { value: '#123456' } });
    expect(onChange).toHaveBeenLastCalledWith('#123456');
    expect(input).toHaveValue('#123456');
  });

  it('shows the full hex form once the text box loses focus', () => {
    render(<ColorPicker initialValue="#4A90E2" />);
    const input = hexBox();
    fireEvent.change(input, { target: { value: '#fff' } });
    fireEvent.blur(input);
    expect(input).toHaveValue('#FFFFFF');
  });

  it('accepts color names', () => {
    const onChange = jest.fn();
    render(<ColorPicker onChange={onChange} />);
    fireEvent.change(hexBox(), { target: { value: 'red' } });
    expect(onChange).toHaveBeenLastCalledWith('#FF0000');
  });

  it('marks the swatch matching the current color as pressed', () => {
    render(<ColorPicker initialValue="#000000" />);
    expect(screen.getByRole('button', { name: 'Select #000000' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Select #F06060' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders a custom palette instead of the default one', () => {
    render(<ColorPicker palette={['#ff0000', '#00ff00']} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Select #00FF00' })).toBeInTheDocument();
  });

  it('copes with duplicate swatches without a key warning', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<ColorPicker palette={['#ff0000', '#ff0000']} />);
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('names the text box and passes name and other attributes to it', () => {
    render(<ColorPicker name="brand_color" aria-label="Brand color" />);
    expect(screen.getByRole('textbox', { name: 'Brand color' })).toHaveAttribute('name', 'brand_color');
  });

  it('groups the swatches under a label', () => {
    render(<ColorPicker />);
    expect(screen.getByRole('group', { name: 'Color palette' })).toBeInTheDocument();
  });

  describe('controlled', () => {
    const Controlled = ({ onChange }) => {
      const [color, setColor] = useState('#4A90E2');
      return <ColorPicker value={color} onChange={(next) => { setColor(next); onChange(next); }} />;
    };

    it('follows the value prop', () => {
      const { rerender } = render(<ColorPicker value="#4A90E2" />);
      expect(hexBox()).toHaveValue('#4A90E2');
      rerender(<ColorPicker value="#F06060" />);
      expect(hexBox()).toHaveValue('#F06060');
    });

    it('reports a swatch pick and shows it once the parent updates', () => {
      const onChange = jest.fn();
      render(<Controlled onChange={onChange} />);
      fireEvent.click(screen.getByRole('button', { name: 'Select #000000' }));
      expect(onChange).toHaveBeenCalledWith('#000000');
      expect(hexBox()).toHaveValue('#000000');
    });

    it('does not rewrite what the user is typing when the parent echoes the value back', () => {
      render(<Controlled onChange={() => {}} />);
      fireEvent.change(hexBox(), { target: { value: '#123' } });
      expect(hexBox()).toHaveValue('#123');
      fireEvent.change(hexBox(), { target: { value: '#123456' } });
      expect(hexBox()).toHaveValue('#123456');
    });
  });
});

describe('ColorPicker building blocks', () => {
  it('ColorPickerPalette reports the clicked color', () => {
    const onColorSelect = jest.fn();
    const { container } = render(<ColorPickerPalette colors={['#ff0000', '#00ff00']} onColorSelect={onColorSelect} />);
    fireEvent.click(container.querySelectorAll('li')[1]);
    expect(onColorSelect).toHaveBeenCalledWith('#00ff00');
  });

  it('ColorPickerPalette renders with no props, as the app builds it', () => {
    const { container } = render(jsx(ColorPickerPalette, {}));
    expect(container.querySelector('.cpr_palette')).toBeInTheDocument();
  });

  it('ColorPickerSlider places its handle from the hue', () => {
    const { container } = render(<ColorPickerSlider hue={90} />);
    expect(container.querySelector('.cpr_slide').style.left).toBe('25%');
  });

  it('ColorPickerSquare places its marker from the color', () => {
    const { container } = render(<ColorPickerSquare hue={0} saturation={100} lightness={50} />);
    const marker = container.querySelector('.cpr_marker');
    expect(marker.style.left).toBe('100%');
    expect(marker.style.top).toBe('0%');
  });
});
