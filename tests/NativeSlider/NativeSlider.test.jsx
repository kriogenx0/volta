import { fireEvent, render, screen } from '@testing-library/react';

import NativeSlider from '../../components/NativeSlider/NativeSlider';

const slider = () => screen.getByRole('slider', { name: 'Speed' });

describe('NativeSlider', () => {
  it('is a range input with the min, max, step and value given', () => {
    render(<NativeSlider aria-label="Speed" min={0} max={500} step={10} value={150} onChange={() => {}} />);
    expect(slider()).toHaveAttribute('type', 'range');
    expect(slider()).toHaveAttribute('min', '0');
    expect(slider()).toHaveAttribute('max', '500');
    expect(slider()).toHaveAttribute('step', '10');
    expect(slider()).toHaveValue('150');
  });

  it('reports the new value as a number', () => {
    const onChange = jest.fn();
    render(<NativeSlider aria-label="Speed" value={20} onChange={onChange} />);
    fireEvent.change(slider(), { target: { value: '70' } });
    expect(onChange).toHaveBeenCalledWith(70, expect.anything());
  });

  it('works uncontrolled from defaultValue', () => {
    render(<NativeSlider aria-label="Speed" defaultValue={30} />);
    expect(slider()).toHaveValue('30');
    fireEvent.change(slider(), { target: { value: '70' } });
    expect(slider()).toHaveValue('70');
  });

  it('sets the filled part of the track from the value', () => {
    const { rerender } = render(<NativeSlider aria-label="Speed" min={0} max={200} value={50} onChange={() => {}} />);
    expect(slider().style.getPropertyValue('--native_slider-fill')).toBe('25%');
    rerender(<NativeSlider aria-label="Speed" min={0} max={200} value={200} onChange={() => {}} />);
    expect(slider().style.getPropertyValue('--native_slider-fill')).toBe('100%');
  });

  it('can be disabled and passes other props to the input', () => {
    render(<NativeSlider aria-label="Speed" name="speed" disabled value={1} onChange={() => {}} />);
    expect(slider()).toBeDisabled();
    expect(slider()).toHaveAttribute('name', 'speed');
  });
});
