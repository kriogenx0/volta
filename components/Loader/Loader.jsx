import PropTypes from "prop-types";
import times from "lodash/times";

import "./Loader.scss";

const Loader = ({ message, size, small, tiny, inline, variant }) => {

  if (small) size = 'small';
  if (tiny) size = 'tiny';

  const containerClass = "volta-loader" +
    ` loader-variant-${variant}` +
    (typeof size !== 'undefined' ? (' loader-' + size) : '') +
    (inline ? ' loader-inline' : '')
    ;

  return (
    <div className={containerClass}>
      <div className="loader-graphic">
        {variant === 'bars' && (
          <div className="loader-bars">
            <div className="bar1" />
            <div className="bar2" />
            <div className="bar3" />
            <div className="bar4" />
            <div className="bar5" />
          </div>
        )}
        {variant === 'clock' && <div className="loader-clock" />}
        {variant === 'knob' && (
          <div className="loader-knob">
            <div className="knob-knob" />
            {times(12, (i) => (
              <div key={i} className="knob-indicator" />
            ))}
          </div>
        )}
        {variant === 'spin' && (
          <div className="loader-spin">
            {times(12, (i) => (
              <div className="spin-arm" key={i} />
            ))}
          </div>
        )}
        {variant === 'block' && (
          <div className="loader-block">
            {times(9, (i) => (
              <div key={i} className="block" />
            ))}
          </div>
        )}
        {variant === 'spinner' && <div className="loader" />}
      </div>
      {typeof message !== 'undefined' ? (<div className="message">{message}</div>) : null}
    </div>
  );
};

Loader.sizes = ['page', 'small', 'large', 'tiny'];
Loader.variants = ['spinner', 'bars', 'clock', 'knob', 'spin', 'block'];

Loader.propTypes = {
  size: PropTypes.oneOf(Loader.sizes),
  variant: PropTypes.oneOf(Loader.variants),
  small: PropTypes.bool
};

Loader.defaultProps = {
  size: 'page',
  variant: 'spinner'
};

export default Loader;
