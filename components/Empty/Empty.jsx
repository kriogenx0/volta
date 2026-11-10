import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';

import './Empty.scss';

// A place with nothing to show. `loading` swaps the message for a Loader (the message
// becomes its caption), so a list can say "Loading" and then "No results" with one
// component. `icon` puts a large drawn icon above the message; "questionmark" is a big
// question mark.
const Empty = ({ children, loading = false, icon }) => (
  <div
    className={`volta-empty${loading ? ' volta-empty--loading' : ''}`}
    role={loading ? 'status' : undefined}
    aria-busy={loading || undefined}
  >
    {loading ? (
      <Loader size="small" message={children} />
    ) : (
      <>
        {icon && <Icon type={icon} className="volta-empty-icon" aria-hidden="true" />}
        {children}
      </>
    )}
  </div>
);

Empty.propTypes = {
  // The message. While loading it is the loader's caption.
  children: PropTypes.node,
  // Show a Loader instead of the message and icon
  loading: PropTypes.bool,
  // The name of a drawn icon to show large above the message, such as "questionmark"
  icon: PropTypes.string
};

const EmptyState = ({ children }) => (
  <div className="volta-empty_state">
    <p className="volta-empty_state-text">{children}</p>
  </div>
);

export { Empty, EmptyState };
export default Empty;
