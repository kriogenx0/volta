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
  onLightnessChange = () => {}
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

    setPosition({ saturation: nextSaturation, value });

    const hsl = tinycolor({ h: hue, s: nextSaturation, v: value }).toHsl();

    onSaturationChange(hsl.s * 100);
    onLightnessChange(hsl.l * 100);
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
    <div className="cpr_square" ref={square} onMouseDown={onMouseDown} style={squareStyle}>
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
  onLightnessChange: PropTypes.func
};
