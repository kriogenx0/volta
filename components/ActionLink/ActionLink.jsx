import React from 'react';
import { Link } from 'react-router-dom';

import './ActionLink.scss';

const ActionLink = ({ to, children, className = '', ...props }) => (
  <Link to={to} className={`volta-action_link ${className}`.trim()} {...props}>{children}</Link>
);

export { ActionLink };
export default ActionLink;
