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
    render(<ColorPicker popover={false} initialValue="#4a90e2" onValueChange={onValueChange} />);

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
    render(<ColorPicker popover={false} palette={['#ff0000', '#00ff00']} />);
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

describe('ColorPicker show', () => {
  const hasChooser = (container) => Boolean(container.querySelector('input[type="color"]'));
  const hasText = () => Boolean(screen.queryByRole('textbox', { name: 'Hex color' }));
  const hasPalette = () => Boolean(screen.queryByRole('group', { name: 'Color palette' }));

  it('shows both the picker and the palette when it is not a popover', () => {
    const { container } = render(<ColorPicker popover={false} />);
    expect(hasChooser(container)).toBe(true);
    expect(hasText()).toBe(true);
    expect(hasPalette()).toBe(true);
  });

  it('shows both with show="both" too', () => {
    const { container } = render(<ColorPicker popover={false} show="both" />);
    expect(hasChooser(container) && hasText() && hasPalette()).toBe(true);
  });

  it('shows only the chooser and the text box with show="picker"', () => {
    const { container } = render(<ColorPicker show="picker" />);
    expect(hasChooser(container)).toBe(true);
    expect(hasText()).toBe(true);
    expect(hasPalette()).toBe(false);
    expect(screen.queryAllByRole('button', { name: /^Select / })).toHaveLength(0);
  });

  it('shows only the swatches with show="palette", and still carries the value in a form', () => {
    const onChange = jest.fn();
    const { container } = render(<ColorPicker show="palette" name="accent" initialValue="#F06060" onChange={onChange} />);
    expect(hasChooser(container)).toBe(false);
    expect(hasText()).toBe(false);
    expect(hasPalette()).toBe(true);
    const hidden = container.querySelector('input[type="hidden"][name="accent"]');
    expect(hidden).toHaveValue('#F06060');

    fireEvent.click(screen.getByRole('button', { name: 'Select #000000' }));
    expect(onChange).toHaveBeenCalledWith('#000000');
    expect(hidden).toHaveValue('#000000');
    expect(screen.getByRole('button', { name: 'Select #000000' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('has no hidden input when the text box is there to carry the name', () => {
    const { container } = render(<ColorPicker name="accent" />);
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
    expect(container.querySelector('input[type="text"][name="accent"]')).toBeInTheDocument();
  });

  it('ignores popover when there is no palette to open', () => {
    const { container } = render(<ColorPicker popover show="picker" />);
    expect(container.firstChild).not.toHaveClass('volta-color_picker--popover');
    expect(screen.queryByRole('button', { name: 'Toggle color palette' })).toBeNull();
    expect(hasChooser(container)).toBe(true);
  });

  it('opens a palette-only popover from its button', () => {
    const { container } = render(<ColorPicker popover show="palette" />);
    expect(hasText()).toBe(false);
    const toggle = screen.getByRole('button', { name: 'Toggle color palette' });
    expect(container.querySelector('.color_picker-palette')).not.toHaveClass('showing');
    fireEvent.click(toggle);
    expect(container.querySelector('.color_picker-palette')).toHaveClass('showing');
  });
});

describe('ColorPicker with its own picker', () => {
  it('uses the square and hue slider instead of the browser chooser', () => {
    render(<ColorPicker picker="custom" initialValue="#FF0000" />);
    expect(screen.queryByLabelText('Choose color')).toBeNull();
    expect(screen.getByRole('slider', { name: 'Saturation and brightness' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Hue' })).toHaveAttribute('aria-valuenow', '0');
  });

  it('changes the hue from the keyboard and reports the new colour', () => {
    const onChange = jest.fn();
    render(<ColorPicker picker="custom" initialValue="#FF0000" onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Hue' }), { key: 'ArrowRight', shiftKey: true });
    expect(onChange).toHaveBeenLastCalledWith('#FF2B00');
    expect(hexBox()).toHaveValue('#FF2B00');
  });

  it('changes saturation and brightness from the keyboard', () => {
    const onChange = jest.fn();
    render(<ColorPicker picker="custom" initialValue="#FF0000" onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Saturation and brightness' }), { key: 'ArrowDown', shiftKey: true });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toBe('#E60000');
  });

  it('keeps the hue when the colour passes through grey', () => {
    render(<ColorPicker picker="custom" initialValue="#FF0000" />);
    fireEvent.change(hexBox(), { target: { value: '#808080' } });
    expect(screen.getByRole('slider', { name: 'Hue' })).toHaveAttribute('aria-valuenow', '0');
  });

  it('puts the picker at the top of the popover', () => {
    const { container } = render(<ColorPicker picker="custom" popover initialValue="#FF0000" />);
    expect(container.querySelector('.color_picker-palette .cpr_square')).toBeInTheDocument();
  });
});

describe('ColorPicker formats, side and text box', () => {
  const box = (name) => screen.getByRole('textbox', { name });

  it('reads rgb(), hsl() and colour names typed in, and reports hex by default', () => {
    const onChange = jest.fn();
    render(<ColorPicker initialValue="#000000" onChange={onChange} />);
    fireEvent.change(box('Hex color'), { target: { value: 'rgb(255, 0, 0)' } });
    expect(onChange).toHaveBeenLastCalledWith('#FF0000');
    fireEvent.change(box('Hex color'), { target: { value: 'hsl(120, 100%, 50%)' } });
    expect(onChange).toHaveBeenLastCalledWith('#00FF00');
    fireEvent.change(box('Hex color'), { target: { value: 'navy' } });
    expect(onChange).toHaveBeenLastCalledWith('#000080');
  });

  it('shows and reports rgb with format="rgb"', () => {
    const onChange = jest.fn();
    render(<ColorPicker format="rgb" initialValue="#FF0000" onChange={onChange} />);
    expect(box('RGB color')).toHaveValue('rgb(255, 0, 0)');
    fireEvent.change(box('RGB color'), { target: { value: '#0000ff' } });
    expect(onChange).toHaveBeenLastCalledWith('rgb(0, 0, 255)');
    fireEvent.blur(box('RGB color'));
    expect(box('RGB color')).toHaveValue('rgb(0, 0, 255)');
  });

  it('shows and reports hsl with format="hsl", and rewrites the box when the format changes', () => {
    const onChange = jest.fn();
    const { rerender } = render(<ColorPicker format="hsl" initialValue="#FF0000" onChange={onChange} />);
    expect(box('HSL color')).toHaveValue('hsl(0, 100%, 50%)');
    fireEvent.click(screen.getByRole('button', { name: 'Select #000000' }));
    expect(onChange).toHaveBeenLastCalledWith('hsl(0, 0%, 0%)');
    rerender(<ColorPicker format="hex" initialValue="#FF0000" onChange={onChange} />);
    expect(box('Hex color')).toHaveValue('#000000');
    expect(ColorPicker.formats).toEqual(['hex', 'rgb', 'hsl']);
  });

  it('puts the native chooser left of the text box by default, or right with side="right"', () => {
    const order = (container) => [...container.querySelector('.color_picker-control').children].map((node) => node.className.split(' ')[0]);
    const { container, rerender } = render(<ColorPicker popover={false} />);
    expect(order(container)).toEqual(['volta-native_color_picker', 'color_picker-input']);
    expect(container.firstChild).toHaveClass('volta-color_picker--chooser_left');
    rerender(<ColorPicker popover={false} side="right" />);
    expect(order(container)).toEqual(['color_picker-input', 'volta-native_color_picker']);
    expect(container.firstChild).toHaveClass('volta-color_picker--chooser_right');
  });

  it('puts the popover button right by default and left with side="left"', () => {
    const order = (container) => [...container.querySelector('.color_picker-control').children].map((node) => node.className.split(' ')[0]);
    const { container, rerender } = render(<ColorPicker popover />);
    expect(order(container)).toEqual(['color_picker-input', 'color_picker-toggle']);
    rerender(<ColorPicker popover side="left" />);
    expect(order(container)).toEqual(['color_picker-toggle', 'color_picker-input']);
  });

  it('leaves the text box out with textbox={false}, and still carries the value in a form', () => {
    const { container } = render(<ColorPicker popover={false} textbox={false} name="brand" initialValue="#FF0000" />);
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByLabelText('Choose color')).toBeInTheDocument();
    expect(container.querySelector('input[type="hidden"][name="brand"]')).toHaveValue('#FF0000');
    expect(container.firstChild).toHaveClass('volta-color_picker--no_text');
  });

  it('shows only the swatch when there is no text box and no palette', () => {
    const { container } = render(<ColorPicker textbox={false} show="picker" />);
    expect(container.firstChild).toHaveClass('volta-color_picker--compact');
  });

  it('keeps the palette without a text box', () => {
    render(<ColorPicker popover={false} textbox={false} initialValue="#FF0000" />);
    fireEvent.click(screen.getByRole('button', { name: 'Select #000000' }));
    expect(screen.getByLabelText('Choose color')).toHaveValue('#000000');
  });

  it('has the popover button alone without a text box', () => {
    render(<ColorPicker popover textbox={false} />);
    expect(screen.getByRole('button', { name: 'Toggle color palette' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).toBeNull();
  });
});
