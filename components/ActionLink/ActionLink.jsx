import React from 'react';
import { Link } from 'react-router-dom';

const ActionLink = ({ to, children, className = '', ...props }) => (
  <Link to={to} className={`whitespace-nowrap text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white ${className}`.trim()} {...props}>{children}</Link>
);

export { ActionLink };
export default ActionLink;
