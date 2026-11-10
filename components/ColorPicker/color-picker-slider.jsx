// Color Picker Hue Slider
// Slide handle to change HUE (0-360)
// Expects an initial hex value and a callback for hue changes

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import useDrag from './useDrag';

export default function ColorPickerSlider({ hue = 180, onHueChange = () => {} }) {
  const [current, setCurrent] = useState(hue);
  const slider = useRef(null);

  useEffect(() => { setCurrent(hue); }, [hue]);

  const setHueFromEvent = (event) => {
    const sliderNode = slider.current;
    const left = sliderNode.getBoundingClientRect().left + window.scrollX;

    let pos = event.pageX - left;
    pos = Math.max(pos, 0);
    pos = Math.min(pos, sliderNode.offsetWidth);

    const next = parseInt((pos / sliderNode.offsetWidth) * 360, 10);

    onHueChange(next);
    setCurrent(next);
  };

  const { onMouseDown } = useDrag(setHueFromEvent);

  // Arrow keys move the handle by 1 degree (10 with Shift); Home and End go to the ends
  const handleKeyDown = (event) => {
    const step = event.shiftKey ? 10 : 1;
    let next = current;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next -= step;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next += step;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 360;
    else return;
    event.preventDefault();
    next = Math.min(Math.max(next, 0), 360);
    onHueChange(next);
    setCurrent(next);
  };

  return (
    <div
      className="cpr_rainbow"
      ref={slider}
      onMouseDown={onMouseDown}
      role="slider"
      tabIndex={0}
      aria-label="Hue"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(current)}
      onKeyDown={handleKeyDown}
    >
      <div className="cpr_slide" style={{ left: `${(current / 360) * 100}%` }}></div>
    </div>
  );
}

ColorPickerSlider.propTypes = {
  hue: PropTypes.number,
  onHueChange: PropTypes.func
};
