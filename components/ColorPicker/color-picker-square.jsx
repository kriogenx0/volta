// Color Picker Saturation and Lightness Square
// Drag marker to return saturation and lightness
// Expects an initial hex value and callbacks for saturation and lightness changes
//
// Note, internally this component uses HSV, externally we use HSL

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';

import useDrag from './useDrag';

const toHsv = (hue, saturation, lightness) => {
  const hsv = tinycolor({ h: hue, s: saturation, l: lightness }).toHsv();
  return { saturation: hsv.s * 100, value: hsv.v * 100 };
};

export default function ColorPickerSquare({
  hue = 0,
  saturation = 100,
  lightness = 100,
  onSaturationChange = () => {},
  onLightnessChange = () => {},
  onColorChange = () => {}
}) {
  const [position, setPosition] = useState(() => toHsv(hue, saturation, lightness));
  const square = useRef(null);

  const setPos = (event) => {
    const squareNode = square.current;
    const rect = squareNode.getBoundingClientRect();
    const left = rect.left + window.scrollX;
    const top = rect.top + window.scrollY;

    const x = Math.min(Math.max(event.pageX - left, 0), squareNode.offsetWidth);
    const y = Math.min(Math.max(event.pageY - top, 0), squareNode.offsetHeight);

    const nextSaturation = (x / squareNode.offsetWidth) * 100;
    const value = ((squareNode.offsetHeight - y) / squareNode.offsetHeight) * 100;

    emit(nextSaturation, value);
  };

  // Reports saturation and brightness (HSV) as the HSL the callers use, once per change
  const emit = (nextSaturation, value) => {
    setPosition({ saturation: nextSaturation, value });

    const hsl = tinycolor({ h: hue, s: nextSaturation, v: value }).toHsl();

    onSaturationChange(hsl.s * 100);
    onLightnessChange(hsl.l * 100);
    onColorChange({ hue, saturation: hsl.s * 100, lightness: hsl.l * 100 });
  };

  // Arrow keys move the marker by 1 (10 with Shift); Home and End go to the edges
  const handleKeyDown = (event) => {
    const step = event.shiftKey ? 10 : 1;
    const clamp = (n) => Math.min(Math.max(n, 0), 100);
    let { saturation: s, value: v } = position;
    if (event.key === 'ArrowLeft') s -= step;
    else if (event.key === 'ArrowRight') s += step;
    else if (event.key === 'ArrowUp') v += step;
    else if (event.key === 'ArrowDown') v -= step;
    else if (event.key === 'Home') s = 0;
    else if (event.key === 'End') s = 100;
    else return;
    event.preventDefault();
    emit(clamp(s), clamp(v));
  };

  const { onMouseDown, dragging } = useDrag(setPos);

  // Follow external changes, but not our own echoes while dragging: the
  // HSL round trip is lossy at the edges and would make the marker jump.
  useEffect(() => {
    if (!dragging.current) setPosition(toHsv(hue, saturation, lightness));
  }, [hue, saturation, lightness]);

  const squareStyle = { backgroundColor: tinycolor({ h: hue, s: 1, l: 0.5 }).toHexString() };
  const markerStyle = { left: `${position.saturation}%`, top: `${100 - position.value}%` };

  return (
    <div
      className="cpr_square"
      ref={square}
      onMouseDown={onMouseDown}
      style={squareStyle}
      role="slider"
      tabIndex={0}
      aria-label="Saturation and brightness"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position.saturation)}
      aria-valuetext={`Saturation ${Math.round(position.saturation)}%, brightness ${Math.round(position.value)}%`}
      onKeyDown={handleKeyDown}
    >
      <div className="cpr_marker" style={markerStyle}></div>
      <div className="cpr_square_val"></div>
      <div className="cpr_square_sat"></div>
    </div>
  );
}

ColorPickerSquare.propTypes = {
  hue: PropTypes.number,
  saturation: PropTypes.number,
  lightness: PropTypes.number,
  onSaturationChange: PropTypes.func,
  onLightnessChange: PropTypes.func,
  // Called once per change with { hue, saturation, lightness } (HSL, 0-360 and 0-100)
  onColorChange: PropTypes.func
};
