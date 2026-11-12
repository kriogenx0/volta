import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent } from '@testing-library/react';

import Slider from '../../components/Slider/Slider';

// jsdom has no layout: give the track a 200px width starting at x=100
beforeEach(() => {
  jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 100, right: 300, top: 0, bottom: 6, width: 200, height: 6, x: 100, y: 0
  });
});
afterEach(() => jest.restoreAllMocks());

const thumb = () => screen.getByRole('slider');
const control = (container) => container.querySelector('.volta-slider');

describe('Slider', () => {
  it('renders without crashing', () => {
    const { container } = render(<Slider />);
    expect(container).toBeInTheDocument();
  });

  it('is a labelled slider with its range and value exposed', () => {
    render(<Slider ariaLabel="Volume" min={10} max={50} value={30} />);
    expect(thumb()).toHaveAttribute('aria-label', 'Volume');
    expect(thumb()).toHaveAttribute('aria-valuemin', '10');
    expect(thumb()).toHaveAttribute('aria-valuemax', '50');
    expect(thumb()).toHaveAttribute('aria-valuenow', '30');
  });

  it('starts in the middle of its range when uncontrolled', () => {
    render(<Slider />);
    expect(thumb()).toHaveAttribute('aria-valuenow', '1');
    expect(thumb()).toHaveStyle({ left: '50%' });
  });

  it('moves on its own when uncontrolled, so the default instance is usable', () => {
    const onChange = jest.fn();
    const { container } = render(<Slider onChange={onChange} />);
    fireEvent.mouseDown(control(container), { clientX: 250, button: 0 });
    expect(onChange).toHaveBeenCalledWith(1.5);
    expect(thumb()).toHaveAttribute('aria-valuenow', '1.5');
  });

  it('only reports a change; a controlled slider waits for its parent', () => {
    const onChange = jest.fn();
    const { container } = render(<Slider value={0} onChange={onChange} />);
    fireEvent.mouseDown(control(container), { clientX: 300, button: 0 });
    expect(onChange).toHaveBeenCalledWith(2);
    expect(thumb()).toHaveAttribute('aria-valuenow', '0');
  });

  it('follows the mouse while dragging, clamped to the track, and stops on release', () => {
    const onChange = jest.fn();
    const { container } = render(<Slider min={0} max={100} defaultValue={0} onChange={onChange} />);
    fireEvent.mouseDown(control(container), { clientX: 100, button: 0 });
    fireEvent.mouseMove(document, { clientX: 200 });
    expect(onChange).toHaveBeenLastCalledWith(50);
    fireEvent.mouseMove(document, { clientX: 999 });
    expect(onChange).toHaveBeenLastCalledWith(100);
    fireEvent.mouseMove(document, { clientX: -50 });
    expect(onChange).toHaveBeenLastCalledWith(0);

    fireEvent.mouseUp(document);
    onChange.mockClear();
    fireEvent.mouseMove(document, { clientX: 250 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('can be dragged by touch', () => {
    const onChange = jest.fn();
    const { container } = render(<Slider min={0} max={100} defaultValue={0} onChange={onChange} />);
    fireEvent.touchStart(control(container), { touches: [{ clientX: 100 }] });
    fireEvent.touchMove(document, { touches: [{ clientX: 150 }] });
    expect(onChange).toHaveBeenLastCalledWith(25);
  });

  it('respects min when mapping position to value', () => {
    const onChange = jest.fn();
    const { container } = render(<Slider min={10} max={20} defaultValue={10} onChange={onChange} />);
    fireEvent.mouseDown(control(container), { clientX: 200, button: 0 });
    expect(onChange).toHaveBeenCalledWith(15);
  });

  it('snaps to step', () => {
    const onChange = jest.fn();
    const { container } = render(<Slider min={0} max={100} step={10} defaultValue={0} onChange={onChange} />);
    fireEvent.mouseDown(control(container), { clientX: 143, button: 0 }); // 21.5%
    expect(onChange).toHaveBeenCalledWith(20);
  });

  it('ignores right-clicks', () => {
    const onChange = jest.fn();
    const { container } = render(<Slider onChange={onChange} />);
    fireEvent.mouseDown(control(container), { clientX: 250, button: 2 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('works from the keyboard', () => {
    const onChange = jest.fn();
    render(<Slider min={0} max={10} step={1} defaultValue={5} onChange={onChange} />);
    fireEvent.keyDown(thumb(), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith(6);
    fireEvent.keyDown(thumb(), { key: 'ArrowLeft' });
    fireEvent.keyDown(thumb(), { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith(4);
    fireEvent.keyDown(thumb(), { key: 'End' });
    expect(onChange).toHaveBeenLastCalledWith(10);
    fireEvent.keyDown(thumb(), { key: 'Home' });
    expect(onChange).toHaveBeenLastCalledWith(0);
    fireEvent.keyDown(thumb(), { key: 'PageUp' });
    expect(onChange).toHaveBeenLastCalledWith(10);
  });

  it('does nothing when disabled', () => {
    const onChange = jest.fn();
    const { container } = render(<Slider disabled onChange={onChange} />);
    fireEvent.mouseDown(control(container), { clientX: 250, button: 0 });
    fireEvent.keyDown(thumb(), { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
    expect(thumb()).toHaveAttribute('aria-disabled', 'true');
    expect(thumb()).toHaveAttribute('tabindex', '-1');
  });
});

describe('Slider animation', () => {
  const rootOf = (container) => container.firstChild;

  it('slides to a clicked place, and follows the pointer at once only after it moves', () => {
    const { container } = render(<Slider defaultValue={0} min={0} max={100} />);
    expect(rootOf(container)).not.toHaveClass('volta-slider--tracking');

    fireEvent.mouseDown(rootOf(container).firstChild, { clientX: 250, button: 0 });
    expect(rootOf(container)).toHaveClass('volta-slider--dragging');
    expect(rootOf(container)).not.toHaveClass('volta-slider--tracking');

    fireEvent.mouseMove(document, { clientX: 300 });
    expect(rootOf(container)).toHaveClass('volta-slider--tracking');

    fireEvent.mouseUp(document);
    expect(rootOf(container)).not.toHaveClass('volta-slider--dragging');
    expect(rootOf(container)).not.toHaveClass('volta-slider--tracking');
  });

  it('animates the fill and the thumb with the global speed, and not while tracking', () => {
    const scss = fs.readFileSync(path.join(__dirname, '../../components/Slider/Slider.scss'), 'utf8');
    expect(scss).toMatch(/\.volta-slider-fill\s*\{[^}]*transition:\s*width var\(--v-anim-speed\) var\(--v-anim-ease\)/);
    expect(scss).toMatch(/\.volta-slider-thumb\s*\{[^}]*transition:[^;]*left var\(--v-anim-speed\) var\(--v-anim-ease\)/);
    expect(scss).toMatch(/--tracking \.volta-slider-fill\s*\{\s*transition:\s*none/);
    expect(scss).not.toMatch(/transition:[^;]*\d+m?s\b/);
  });
});

describe('Slider buttons', () => {
  const minus = () => screen.getByRole('button', { name: 'Decrease Zoom' });
  const plus = () => screen.getByRole('button', { name: 'Increase Zoom' });

  it('has no buttons by default', () => {
    render(<Slider ariaLabel="Zoom" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows a – and a + button named for the slider', () => {
    render(<Slider ariaLabel="Zoom" buttons />);
    expect(minus()).toBeInTheDocument();
    expect(plus()).toBeInTheDocument();
  });

  it('moves the value by one step each press, and reports it', () => {
    const onChange = jest.fn();
    render(<Slider ariaLabel="Zoom" buttons min={0} max={100} step={10} defaultValue={50} onChange={onChange} />);
    fireEvent.click(plus());
    expect(thumb()).toHaveAttribute('aria-valuenow', '60');
    expect(onChange).toHaveBeenLastCalledWith(60);
    fireEvent.click(minus());
    fireEvent.click(minus());
    expect(thumb()).toHaveAttribute('aria-valuenow', '40');
    expect(onChange).toHaveBeenLastCalledWith(40);
  });

  it('moves by a tenth of the range when there is no step', () => {
    render(<Slider ariaLabel="Zoom" buttons min={0} max={2} defaultValue={1} />);
    fireEvent.click(plus());
    expect(thumb()).toHaveAttribute('aria-valuenow', '1.2');
  });

  it('stops at each end, disabling the button there', () => {
    render(<Slider ariaLabel="Zoom" buttons min={0} max={100} step={50} defaultValue={50} />);
    fireEvent.click(plus());
    expect(thumb()).toHaveAttribute('aria-valuenow', '100');
    expect(plus()).toBeDisabled();
    expect(minus()).toBeEnabled();
    fireEvent.click(minus());
    fireEvent.click(minus());
    expect(thumb()).toHaveAttribute('aria-valuenow', '0');
    expect(minus()).toBeDisabled();
  });

  it('follows a controlled value, only reporting the press', () => {
    const onChange = jest.fn();
    render(<Slider ariaLabel="Zoom" buttons min={0} max={100} step={10} value={50} onChange={onChange} />);
    fireEvent.click(plus());
    expect(onChange).toHaveBeenCalledWith(60);
    expect(thumb()).toHaveAttribute('aria-valuenow', '50');
  });

  it('disables both buttons with the slider', () => {
    render(<Slider ariaLabel="Zoom" buttons disabled />);
    expect(minus()).toBeDisabled();
    expect(plus()).toBeDisabled();
  });
});
