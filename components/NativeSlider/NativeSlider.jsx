import PropTypes from 'prop-types';

import './NativeSlider.scss';

// The browser's own range input (<input type="range">), styled to match Slider: the
// keyboard, touch, step snapping and screen reader behaviour are the browser's. `onChange`
// gets the number, not the event. Controlled with `value`, or uncontrolled with `defaultValue`.
const NativeSlider = ({ value, defaultValue, min = 0, max = 100, step = 1, onChange, className, style, ...otherProps }) => {
  const current = value !== undefined ? value : defaultValue;
  // Where the filled part of the track ends: a runtime value, so it is a custom property
  const percent = current !== undefined && max > min ? ((current - min) / (max - min)) * 100 : 0;

  return (
    <input
      {...otherProps}
      className={['volta-native_slider', className].filter(Boolean).join(' ')}
      style={{ ...style, '--native_slider-fill': `${percent}%` }}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onChange={(event) => onChange && onChange(Number(event.target.value), event)}
    />
  );
};

NativeSlider.propTypes = {
  // Controlled value; leave undefined for an uncontrolled slider
  value: PropTypes.number,
  // Starting value of an uncontrolled slider
  defaultValue: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  // Called with the number, then the change event
  onChange: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object
};

export { NativeSlider };
export default NativeSlider;
