import PropTypes from 'prop-types';

import useEscapeKey from '../Overlay/useEscapeKey';

import './Drawer.scss';

// A panel that slides in from the right edge of its nearest positioned
// ancestor, over a dimming scrim. `open` shows it; clicking the scrim or
// pressing Escape calls `onClose`, so the parent owns the open state.
const Drawer = ({ width = '50%', className, open = false, label, children, onClose }) => {
  useEscapeKey(onClose, open);

  return (
    <div className={`volta-drawer${className ? ' ' + className : ''}${open ? ' drawer-open' : ''}`}>
      <div className='drawer-contents' style={{ width }} role='dialog' aria-label={label}>
        {children}
      </div>
      <div className='drawer-overlay' onClick={onClose} />
    </div>
  );
};

Drawer.propTypes = {
  open: PropTypes.bool,
  // Any CSS width: '50%' (default), '320px', ...
  width: PropTypes.string,
  className: PropTypes.string,
  // Accessible name for the panel
  label: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func
};

export default Drawer;
