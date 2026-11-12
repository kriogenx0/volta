import PropTypes from 'prop-types';

import { useFieldControl } from '../Field/fieldContext';

import './Toggle.scss';

// The track is one size. `knobSize` is the round knob in it: 'sm' (the default) sits inset in the
// track, 'md' fills the track's height as the knob used to (Toggle.knobSizes lists them).
// Inside a Field it takes the Field's id, hint and error (its label then names the switch).
export default function Toggle({ name, checked, onChange = () => {}, className, isDisabled = false, showMarks = false, knobSize = 'sm', value, ...otherProps }) {
  const inField = useFieldControl({ id: otherProps.id, 'aria-describedby': otherProps['aria-describedby'], 'aria-invalid': otherProps['aria-invalid'] });
  const toggleClass = `volta-toggle volta-toggle--knob_${knobSize} ${className || ''} ${isDisabled ? 'toggle-disabled' : ''} ${checked ? 'toggle-checked' : ''}${showMarks ? ' toggle-marks' : ''}`;

  const inputProps = {
    name,
    value,
    checked,
    onChange,
    disabled: isDisabled,
    ...otherProps,
    ...inField
  };

  return (
    <label className={toggleClass}>
      <input type="checkbox" {...inputProps} />
      <span className="toggle-body">
        <span className="toggle-switch" />
        <span className="toggle-track">
          <span className="toggle-bg" />
          <span className="toggle-bg toggle-bg-negative" />
          {/* The I and O marks. The knob covers the one for the other state, so only the current one shows. */}
          {showMarks && <span className="toggle-mark toggle-mark-on" aria-hidden="true">I</span>}
          {showMarks && <span className="toggle-mark toggle-mark-off" aria-hidden="true">O</span>}
        </span>
      </span>
    </label>
  );
}

Toggle.propTypes = {
  name: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
  // Print an I on the on side and an O on the off side, as a second cue besides colour
  showMarks: PropTypes.bool,
  // The knob: 'sm' (the default, 19px across with the border) or 'md' (27px, as tall as the track, as it used to be)
  knobSize: PropTypes.oneOf(['sm', 'md']),
  value: PropTypes.string,
  className: PropTypes.string,
};

Toggle.knobSizes = ['sm', 'md'];
