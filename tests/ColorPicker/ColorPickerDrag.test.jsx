import { createEvent, fireEvent, render } from '@testing-library/react';

import Slider from '../../components/ColorPicker/color-picker-slider';
import Square from '../../components/ColorPicker/color-picker-square';

// jsdom has no layout, so give the element a 100x100 box at the origin.
const sized = (el) => {
  el.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 });
  Object.defineProperty(el, 'offsetWidth', { value: 100 });
  Object.defineProperty(el, 'offsetHeight', { value: 100 });
};

// jsdom ignores pageX/pageY in the event init, so set them on the event.
const fire = (type, target, { pageX = 0, pageY = 0, ...init } = {}) => {
  const event = createEvent[type](target, init);
  Object.defineProperty(event, 'pageX', { value: pageX });
  Object.defineProperty(event, 'pageY', { value: pageY });
  fireEvent(target, event);
};

describe('ColorPickerSlider', () => {
  it('reports hue while dragging and stops after mouse up', () => {
    const onHueChange = jest.fn();
    const { container } = render(<Slider hue={0} onHueChange={onHueChange} />);
    const rainbow = container.querySelector('.cpr_rainbow');
    sized(rainbow);

    fire('mouseDown', rainbow, { button: 0, pageX: 50 });
    expect(onHueChange).toHaveBeenLastCalledWith(180);

    fire('mouseMove', document, { pageX: 25 });
    expect(onHueChange).toHaveBeenLastCalledWith(90);
    expect(container.querySelector('.cpr_slide').style.left).toBe('25%');

    fireEvent.mouseUp(document);
    onHueChange.mockClear();
    fire('mouseMove', document, { pageX: 75 });
    expect(onHueChange).not.toHaveBeenCalled();
  });

  it('ignores non-left clicks and shows the initial hue', () => {
    const onHueChange = jest.fn();
    const { container } = render(<Slider hue={90} onHueChange={onHueChange} />);
    expect(container.querySelector('.cpr_slide').style.left).toBe('25%');

    fire('mouseDown', container.querySelector('.cpr_rainbow'), { button: 2, pageX: 50 });
    expect(onHueChange).not.toHaveBeenCalled();
  });
});

describe('ColorPickerSquare', () => {
  it('reports saturation and lightness while dragging', () => {
    const onSaturationChange = jest.fn();
    const onLightnessChange = jest.fn();
    const { container } = render(
      <Square hue={0} onSaturationChange={onSaturationChange} onLightnessChange={onLightnessChange} />,
    );
    const square = container.querySelector('.cpr_square');
    sized(square);

    fire('mouseDown', square, { button: 0, pageX: 100, pageY: 0 });
    expect(onSaturationChange).toHaveBeenLastCalledWith(100);
    expect(onLightnessChange).toHaveBeenLastCalledWith(50);
    expect(container.querySelector('.cpr_marker').style.left).toBe('100%');

    fireEvent.mouseUp(document);
    onSaturationChange.mockClear();
    fire('mouseMove', document, { pageX: 10, pageY: 10 });
    expect(onSaturationChange).not.toHaveBeenCalled();
  });
});
