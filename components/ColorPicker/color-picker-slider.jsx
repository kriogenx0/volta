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

  return (
    <div className="cpr_rainbow" ref={slider} onMouseDown={onMouseDown}>
      <div className="cpr_slide" style={{ left: `${(current / 360) * 100}%` }}></div>
    </div>
  );
}

ColorPickerSlider.propTypes = {
  hue: PropTypes.number,
  onHueChange: PropTypes.func
};
