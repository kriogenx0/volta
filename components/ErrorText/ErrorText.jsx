import React from 'react';
import PropTypes from 'prop-types';

import './ErrorText.scss';

const ErrorText = ({ message }) => <p className="volta-error_text">{message}</p>;

ErrorText.propTypes = {
  // Text, or markup such as <strong> for emphasis
  message: PropTypes.node
};

export { ErrorText };
export default ErrorText;
