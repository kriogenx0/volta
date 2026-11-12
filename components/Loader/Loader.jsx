import PropTypes from "prop-types";

import "./Loader.scss";

const Loader = ({ message, size = 'page', small, tiny, inline, variant = 'spinner' }) => {

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
        {variant === 'spin' && (
          <div className="loader-spin">
            {Array.from({ length: 12 }, (_, i) => (
              <div className="spin-arm" key={i} />
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
Loader.variants = ['spinner', 'bars', 'clock', 'spin'];

Loader.propTypes = {
  size: PropTypes.oneOf(Loader.sizes),
  variant: PropTypes.oneOf(Loader.variants),
  small: PropTypes.bool
};

export default Loader;
