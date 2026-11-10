import PropTypes from 'prop-types';

import useEscapeKey from '../Overlay/useEscapeKey';

import './Drawer.scss';

// A panel that slides in from an edge of its nearest positioned ancestor, over a
// dimming scrim: the right edge by default, or with `edge` the left, top or bottom.
// `open` shows it; clicking the scrim or pressing Escape calls `onClose`, so the
// parent owns the open state. The edges are named as SwiftUI names an Edge: leading
// (the left, in a left-to-right page), trailing (the right), top and bottom.
const Drawer = ({ width = '50%', height = '50%', edge = 'trailing', className, open = false, label, children, onClose }) => {
  useEscapeKey(onClose, open);

  // A side drawer is as wide as asked; a top or bottom one is as tall as asked
  const size = edge === 'top' || edge === 'bottom' ? { height } : { width };

  return (
    <div className={`volta-drawer drawer-edge-${edge}${className ? ' ' + className : ''}${open ? ' drawer-open' : ''}`}>
      <div className='drawer-contents' style={size} role='dialog' aria-label={label}>
        {children}
      </div>
      <div className='drawer-overlay' onClick={onClose} />
    </div>
  );
};

Drawer.propTypes = {
  open: PropTypes.bool,
  // Which edge it slides in from: leading (left), trailing (right, the default), top or bottom
  edge: PropTypes.oneOf(['leading', 'trailing', 'top', 'bottom']),
  // How wide a leading or trailing drawer is: any CSS width: '50%' (default), '320px', ...
  width: PropTypes.string,
  // How tall a top or bottom drawer is: any CSS height: '50%' (default), '320px', ...
  height: PropTypes.string,
  className: PropTypes.string,
  // Accessible name for the panel
  label: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func
};

Drawer.edges = ['leading', 'trailing', 'top', 'bottom'];

export default Drawer;
