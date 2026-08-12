import React from 'react';

import './Empty.scss';

const Empty = ({ children }) => <div className="volta-empty">{children}</div>;

const EmptyState = ({ children }) => (
  <div className="flex min-h-[55vh] items-center justify-center px-4 text-center">
    <p className="text-sm text-gray-400 dark:text-gray-500">{children}</p>
  </div>
);

export { Empty, EmptyState };
export default Empty;
