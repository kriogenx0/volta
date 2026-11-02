import React from 'react';

import './Empty.scss';

const Empty = ({ children }) => <div className="volta-empty">{children}</div>;

const EmptyState = ({ children }) => (
  <div className="volta-empty_state">
    <p className="volta-empty_state-text">{children}</p>
  </div>
);

export { Empty, EmptyState };
export default Empty;
