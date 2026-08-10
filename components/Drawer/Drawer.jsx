import PropTypes from 'prop-types';

import './Drawer.scss';

const Drawer = ({ width, className, open, children, onClose }) => (
  <div className={`v-drawer${className ? ' ' + className : ''}${open ? ' drawer-open' : ''}`}>
    <div className='drawer-contents' style={{ width }}>
      {children}
    </div>
    <div className='drawer-overlay' onClick={onClose} />
  </div>
);

Drawer.propTypes = {
  open: PropTypes.bool,
  width: PropTypes.string,
  className: PropTypes.string
};

Drawer.defaultProps = {
  width: '50%'
};

export default Drawer;
