import { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import ColorPicker, { ColorPalettePicker } from '../../components/ColorPicker/ColorPicker';

const palette = (container) => container.querySelector('.color_picker-palette');
const toggleButton = () => screen.getByRole('button', { name: 'Toggle color palette' });

// ColorPicker with popover, and ColorPalettePicker, which is that with 20 presets
// and a text box named "Color".
describe.each([
  ['ColorPicker popover', (props) => <ColorPicker popover {...props} />, 'Hex color'],
  ['ColorPalettePicker', (props) => <ColorPalettePicker {...props} />, 'Color']
])('%s', (_name, make, boxName) => {
  const textBox = () => screen.getByRole('textbox', { name: boxName });

  it('renders a text box and a swatch button, and no native chooser', () => {
    const { container } = render(make());
    expect(textBox()).toBeInTheDocument();
    expect(toggleButton()).toBeInTheDocument();
    expect(container.querySelector('input[type="color"]')).toBeNull();
    expect(container.firstChild).toHaveClass('volta-color_picker', 'volta-color_picker--popover');
  });

  it('starts closed', () => {
    const { container } = render(make());
    expect(palette(container)).not.toHaveClass('showing');
    expect(toggleButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the value in the text box and on the swatch button', () => {
    render(make({ value: '#9060F0' }));
    expect(textBox()).toHaveValue('#9060F0');
    expect(toggleButton()).toHaveStyle({ backgroundColor: '#9060F0' });
  });

  it('follows a changed value prop', () => {
    const { rerender } = render(make({ value: '#ffffff' }));
    rerender(make({ value: '#000000' }));
    expect(textBox()).toHaveValue('#000000');
  });

  it('treats a null value as not given, so it can be typed into', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(make({ value: null }));
    fireEvent.change(textBox(), { target: { value: 'red' } });
    expect(textBox()).toHaveValue('red');
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('reports a typed colour as #RRGGBB and leaves the text as typed', () => {
    const onChange = jest.fn();
    render(make({ onChange }));
    fireEvent.change(textBox(), { target: { value: '#abc' } });
    expect(onChange).toHaveBeenCalledWith('#AABBCC');
    expect(textBox()).toHaveValue('#abc');
  });

  it('does not report text that is not a colour, and restores the colour on blur', () => {
    const onChange = jest.fn();
    render(make({ value: '#4A90E2', onChange }));
    fireEvent.change(textBox(), { target: { value: 'nope' } });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.blur(textBox());
    expect(textBox()).toHaveValue('#4A90E2');
  });

  it('opens the palette when the text box is focused', () => {
    const { container } = render(make());
    fireEvent.focus(textBox());
    expect(palette(container)).toHaveClass('showing');
  });

  it('toggles the palette from the swatch button and says so', () => {
    const { container } = render(make());
    fireEvent.click(toggleButton());
    expect(palette(container)).toHaveClass('showing');
    expect(toggleButton()).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(toggleButton());
    expect(palette(container)).not.toHaveClass('showing');
  });

  it('picks a swatch: fills the text box, calls onChange and closes', () => {
    const onChange = jest.fn();
    const { container } = render(make({ onChange }));
    fireEvent.focus(textBox());
    fireEvent.click(screen.getByRole('button', { name: 'Select #F06060' }));
    expect(textBox()).toHaveValue('#F06060');
    expect(onChange).toHaveBeenCalledWith('#F06060');
    expect(palette(container)).not.toHaveClass('showing');
  });

  it('names every preset and marks the current one as pressed', () => {
    render(make({ value: '#f06060' }));
    expect(screen.getByRole('button', { name: 'Select #F06060' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Select #000000' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('closes on Escape', () => {
    const { container } = render(make());
    fireEvent.focus(textBox());
    fireEvent.keyDown(textBox(), { key: 'Escape' });
    expect(palette(container)).not.toHaveClass('showing');
  });

  describe('closing when focus leaves', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('closes shortly after the text box loses focus', () => {
      const { container } = render(make());
      fireEvent.focus(textBox());
      fireEvent.blur(textBox());
      expect(palette(container)).toHaveClass('showing');
      act(() => { jest.advanceTimersByTime(250); });
      expect(palette(container)).not.toHaveClass('showing');
    });

    it('stays open when focus moves to a swatch', () => {
      const { container } = render(make());
      fireEvent.focus(textBox());
      fireEvent.blur(textBox());
      fireEvent.focus(screen.getByRole('button', { name: 'Select #000000' }));
      act(() => { jest.advanceTimersByTime(250); });
      expect(palette(container)).toHaveClass('showing');
    });

    it('does not fire a state update after unmounting', () => {
      const error = jest.spyOn(console, 'error').mockImplementation(() => {});
      const { unmount } = render(make());
      fireEvent.focus(textBox());
      fireEvent.blur(textBox());
      unmount();
      act(() => { jest.advanceTimersByTime(250); });
      expect(error).not.toHaveBeenCalled();
      error.mockRestore();
    });
  });

  it('works controlled by a parent', () => {
    const Parent = () => {
      const [color, setColor] = useState('#4A90E2');
      return (<>{make({ value: color, onChange: setColor })}<output>{color}</output></>);
    };
    render(<Parent />);
    fireEvent.click(screen.getByRole('button', { name: 'Select #000000' }));
    expect(screen.getByRole('status')).toHaveTextContent('#000000');
    expect(textBox()).toHaveValue('#000000');
  });
});

describe('ColorPalettePicker as a ColorPicker', () => {
  it('has 20 presets, in its own list', () => {
    render(<ColorPalettePicker />);
    expect(ColorPalettePicker.colors).toHaveLength(20);
    expect(screen.getAllByRole('button', { name: /^Select / })).toHaveLength(20);
  });

  it('a popover ColorPicker has the default 12', () => {
    render(<ColorPicker popover />);
    expect(screen.getAllByRole('button', { name: /^Select / })).toHaveLength(12);
  });

  it('is a popover by default, and popover={false} is the inline form: native chooser, no toggle, palette always showing', () => {
    const { container, rerender } = render(<ColorPicker />);
    expect(container.firstChild).toHaveClass('volta-color_picker--popover');
    expect(screen.getByRole('button', { name: 'Toggle color palette' })).toBeInTheDocument();
    expect(container.querySelector('input[type="color"]')).toBeNull();
    rerender(<ColorPicker popover={false} />);
    expect(container.querySelector('input[type="color"]')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Toggle color palette' })).toBeNull();
    expect(container.firstChild).not.toHaveClass('volta-color_picker--popover');
  });

  it('lets the caller name the text box', () => {
    render(<ColorPalettePicker aria-label="Label colour" />);
    expect(screen.getByRole('textbox', { name: 'Label colour' })).toBeInTheDocument();
  });
});
