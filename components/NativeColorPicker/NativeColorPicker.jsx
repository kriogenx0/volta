import PropTypes from 'prop-types';

import './NativeColorPicker.scss';

// The browser's own colour chooser (<input type="color">), styled to match the other
// fields. It always has a colour, so `value` is a #RRGGBB string and `onChange` gets one.
const NativeColorPicker = ({ value = '#000000', onChange, 'aria-label': ariaLabel = 'Choose color', className, ...otherProps }) => (
  <input
    {...otherProps}
    className={['volta-native_color_picker', className].filter(Boolean).join(' ')}
    type="color"
    value={value}
    aria-label={ariaLabel}
    onChange={(event) => onChange && onChange(event.target.value)}
  />
);

NativeColorPicker.propTypes = {
  // The current colour as #RRGGBB
  value: PropTypes.string,
  // Called with the chosen colour as #RRGGBB
  onChange: PropTypes.func,
  'aria-label': PropTypes.string,
  className: PropTypes.string
};

export { NativeColorPicker };
export default NativeColorPicker;
