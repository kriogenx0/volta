import { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import ColorPalettePicker from '../../components/ColorPalettePicker/ColorPalettePicker';

const textBox = () => screen.getByRole('textbox', { name: 'Color' });
const palette = (container) => container.querySelector('.colors');

describe('ColorPalettePicker', () => {
  it('renders without crashing', () => {
    const { container } = render(<ColorPalettePicker />);
    expect(container).toBeInTheDocument();
  });

  it('starts empty and closed with no props', () => {
    const { container } = render(<ColorPalettePicker />);
    expect(textBox()).toHaveValue('');
    expect(palette(container)).not.toHaveClass('showing');
  });

  it('shows the value prop in the text box and on the swatch button', () => {
    render(<ColorPalettePicker value="#9060F0" />);
    expect(textBox()).toHaveValue('#9060F0');
    expect(screen.getByRole('button', { name: 'Toggle color palette' })).toHaveStyle({ backgroundColor: '#9060F0' });
  });

  it('follows a changed value prop', () => {
    const { rerender } = render(<ColorPalettePicker value="#ffffff" />);
    rerender(<ColorPalettePicker value="#000000" />);
    expect(textBox()).toHaveValue('#000000');
  });

  it('can be typed into from empty without a controlled/uncontrolled warning', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<ColorPalettePicker />);
    fireEvent.change(textBox(), { target: { value: 'red' } });
    expect(textBox()).toHaveValue('red');
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('reports typed text through onChange', () => {
    const onChange = jest.fn();
    render(<ColorPalettePicker onChange={onChange} />);
    fireEvent.change(textBox(), { target: { value: '#abc' } });
    expect(onChange).toHaveBeenCalledWith('#abc');
  });

  it('opens the palette when the text box is focused', () => {
    const { container } = render(<ColorPalettePicker />);
    fireEvent.focus(textBox());
    expect(palette(container)).toHaveClass('showing');
  });

  it('toggles the palette from the swatch button and says so', () => {
    const { container } = render(<ColorPalettePicker />);
    const toggle = screen.getByRole('button', { name: 'Toggle color palette' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggle);
    expect(palette(container)).toHaveClass('showing');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(toggle);
    expect(palette(container)).not.toHaveClass('showing');
  });

  it('picks a swatch: fills the text box, calls onChange and closes', () => {
    const onChange = jest.fn();
    const { container } = render(<ColorPalettePicker onChange={onChange} />);
    fireEvent.focus(textBox());
    fireEvent.click(screen.getByRole('button', { name: 'Select #F06060' }));

    expect(textBox()).toHaveValue('#F06060');
    expect(onChange).toHaveBeenCalledWith('#F06060');
    expect(palette(container)).not.toHaveClass('showing');
  });

  it('gives every preset a name and marks the current one as pressed', () => {
    render(<ColorPalettePicker value="#f06060" />);
    expect(screen.getByRole('button', { name: 'Select #F06060' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Select #000000' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getAllByRole('button', { name: /^Select / })).toHaveLength(ColorPalettePicker.colors.length);
  });

  it('closes on Escape', () => {
    const { container } = render(<ColorPalettePicker />);
    fireEvent.focus(textBox());
    fireEvent.keyDown(textBox(), { key: 'Escape' });
    expect(palette(container)).not.toHaveClass('showing');
  });

  describe('closing when focus leaves', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('closes shortly after the text box loses focus', () => {
      const { container } = render(<ColorPalettePicker />);
      fireEvent.focus(textBox());
      fireEvent.blur(textBox());
      expect(palette(container)).toHaveClass('showing');
      act(() => { jest.advanceTimersByTime(250); });
      expect(palette(container)).not.toHaveClass('showing');
    });

    it('stays open when focus moves to a swatch', () => {
      const { container } = render(<ColorPalettePicker />);
      fireEvent.focus(textBox());
      fireEvent.blur(textBox());
      fireEvent.focus(screen.getByRole('button', { name: 'Select #000000' }));
      act(() => { jest.advanceTimersByTime(250); });
      expect(palette(container)).toHaveClass('showing');
    });

    it('does not fire a state update after unmounting', () => {
      const error = jest.spyOn(console, 'error').mockImplementation(() => {});
      const { unmount } = render(<ColorPalettePicker />);
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
      return (<><ColorPalettePicker value={color} onChange={setColor} /><output>{color}</output></>);
    };
    render(<Parent />);
    fireEvent.click(screen.getByRole('button', { name: 'Select #000000' }));
    expect(screen.getByRole('status')).toHaveTextContent('#000000');
    expect(textBox()).toHaveValue('#000000');
  });
});
