import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './PopOver.scss';

const PopOver = ({ open, fullSize, closeOnOverlayClick, handleClose, className, children }) => {
  const overlay = useRef(null);

  const closeModal = () => {
    if (handleClose) handleClose();
  };

  useEffect(() => {
    if (!open) return undefined;

    const el = document.createElement('div');
    el.className = 'overlay';
    document.body.appendChild(el);
    overlay.current = el;

    const onOverlayClick = () => {
      if (closeOnOverlayClick) closeModal();
    };

    if (closeOnOverlayClick) {
      el.addEventListener('click', onOverlayClick);
    }

    return () => {
      el.removeEventListener('click', onOverlayClick);
      document.body.removeChild(el);
      overlay.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closeOnOverlayClick]);

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) closeModal();
  };

  const modalClass = `c-pop_over${fullSize ? ' pop_over-full' : ''}${open ? ' pop_over-open in' : ''} ${className}`;

  return (
    <div className={modalClass} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
      {!fullSize && (
        <div className="inner-overlay" onClick={handleOverlayClick}></div>
      )}
      <div className="dialog content" role="document">
        {children}
      </div>
    </div>
  );
};

PopOver.defaultProps = {
  // Start open or closed
  open: false,
  // Full screen?
  fullSize: true,
  // Clone when clicking overlay
  closeOnOverlayClick: true,
  // Callback for closing dialog
  handleClose: null,
  className: null
};

PopOver.propTypes = {
  open: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  handleClose: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.array
};

export default PopOver;
