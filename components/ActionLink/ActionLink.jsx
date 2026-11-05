import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './ActionLink.scss';

const ActionLink = ({ to, children, className = '', ...props }) => (
  <Link to={to} className={`volta-action_link ${className}`.trim()} {...props}>{children}</Link>
);

ActionLink.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  className: PropTypes.string,
  children: PropTypes.node
};

export { ActionLink };
export default ActionLink;
