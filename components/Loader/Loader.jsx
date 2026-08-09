import React from "react";
import PropTypes from "prop-types";

import "./Loader.scss";

const Loader = ({ message, size, small, tiny, inline }) => {

  if (small) size = 'small';
  if (tiny) size = 'tiny';

  const containerClass = "soda-loader" +
    (typeof size !== 'undefined' ? (' loader-' + size) : '') +
    (inline ? ' loader-inline' : '')
    ;

  return (
    <div className={containerClass}>
      <div className="loader" />
      {typeof message !== 'undefined' ? (<div className="message">{message}</div>) : null}
    </div>
  );
};

Loader.sizes = ['page', 'small', 'large', 'tiny'];

Loader.propTypes = {
  size: PropTypes.oneOf(Loader.sizes),
  small: PropTypes.bool
};

Loader.defaultProps = {
  size: 'page'
};

export default Loader;