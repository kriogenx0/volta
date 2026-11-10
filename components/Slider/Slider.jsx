import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './Slider.scss';

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

// Drag the thumb, click the track, or use the keyboard. Works controlled
// (value + onChange) or uncontrolled (optional defaultValue). A click on the track or
// a key press slides the thumb to its new place; once the pointer moves while pressed
// ("tracking") it follows the pointer at once, so dragging never lags behind.
const Slider = ({ value: controlledValue, defaultValue, min = 0, max = 2, step, disabled = false, ariaLabel, onChange = () => {} }) => {
  const [internalValue, setInternalValue] = useState(defaultValue === undefined ? (min + max) / 2 : defaultValue);
  const [dragging, setDragging] = useState(false);
  const [tracking, setTracking] = useState(false);
  const trackRef = useRef(null);

  const value = clamp(controlledValue === undefined ? internalValue : controlledValue, min, max);
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;

  // Snap to `step` when given, and round away floating point noise
  const normalize = (raw) => {
    const snapped = step ? Math.round((raw - min) / step) * step + min : raw;
    return Number(clamp(snapped, min, max).toFixed(10));
  };

  const update = (raw) => {
    const next = normalize(raw);
    if (next === value) return;
    if (controlledValue === undefined) setInternalValue(next);
    onChange(next);
  };

  const updateFromPoint = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    if (!rect.width) return;
    update(min + clamp((clientX - rect.left) / rect.width, 0, 1) * (max - min));
  };

  // While dragging, follow the mouse / finger anywhere on the page
  useEffect(() => {
    if (!dragging) return undefined;

    const move = (event) => {
      const point = event.touches ? event.touches[0] : event;
      setTracking(true);
      updateFromPoint(point.clientX);
    };
    const stop = () => {
      setDragging(false);
      setTracking(false);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stop);
    document.addEventListener('touchmove', move);
    document.addEventListener('touchend', stop);
    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', stop);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', stop);
    };
  }, [dragging, value, min, max, step, controlledValue]);

  const startDrag = (event) => {
    if (disabled) return;
    if (event.type === 'mousedown' && event.button !== 0) return;

    const point = event.touches ? event.touches[0] : event;
    if (event.cancelable) event.preventDefault(); // no text selection while dragging
    updateFromPoint(point.clientX);
    setDragging(true);
  };

  const handleKeyDown = (event) => {
    if (disabled) return;

    const unit = step || (max - min) / 100;
    const keys = {
      ArrowRight: value + unit,
      ArrowUp: value + unit,
      ArrowLeft: value - unit,
      ArrowDown: value - unit,
      PageUp: value + unit * 10,
      PageDown: value - unit * 10,
      Home: min,
      End: max
    };
    if (!(event.key in keys)) return;

    event.preventDefault();
    update(keys[event.key]);
  };

  return (
    <div
      className={`volta-slider${disabled ? ' volta-slider--disabled' : ''}${dragging ? ' volta-slider--dragging' : ''}${tracking ? ' volta-slider--tracking' : ''}`}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
    >
      <div className="volta-slider-track" ref={trackRef}>
        <div className="volta-slider-fill" style={{ width: `${percent}%` }} />
        <div
          className="volta-slider-thumb"
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-disabled={disabled || undefined}
          style={{ left: `${percent}%` }}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

Slider.propTypes = {
  // Controlled value; leave undefined for an uncontrolled slider
  value: PropTypes.number,
  // Starting value of an uncontrolled slider (defaults to the middle)
  defaultValue: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  // Snap to multiples of step from min; the keyboard moves by it too
  step: PropTypes.number,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
  onChange: PropTypes.func
};

export default Slider;
