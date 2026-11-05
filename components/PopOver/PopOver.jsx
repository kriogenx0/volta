import { useEffect } from 'react';
import PropTypes from 'prop-types';

import useEscapeKey from '../Overlay/useEscapeKey';

import './PopOver.scss';

// A panel shown over the page while `open`. By default (`fullSize`) a
// translucent backdrop covers the window and the content sits on it; with
// `fullSize={false}` the content stays where it is in the page, over a faint
// click-catcher. With `closeOnOverlayClick`, a click on the backdrop or Escape
// calls `handleClose` -- the parent owns the open state.
const PopOver = ({
  open = false,
  fullSize = true,
  closeOnOverlayClick = true,
  handleClose = null,
  className = null,
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby
}) => {
  const closeModal = () => {
    if (handleClose) handleClose();
  };

  useEscapeKey(closeModal, open && closeOnOverlayClick);

  useEffect(() => {
    if (!open) return undefined;

    const el = document.createElement('div');
    el.className = 'overlay';
    document.body.appendChild(el);

    const onOverlayClick = () => {
      if (closeOnOverlayClick) closeModal();
    };

    if (closeOnOverlayClick) {
      el.addEventListener('click', onOverlayClick);
    }

    return () => {
      el.removeEventListener('click', onOverlayClick);
      document.body.removeChild(el);
    };
    // closeModal reads the latest handleClose each render; re-attaching on every
    // render would churn the overlay element, so only open/closeOnOverlayClick matter.
  }, [open, closeOnOverlayClick]);

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) closeModal();
  };

  // Full size: the popover's own root is the backdrop (the appended .overlay
  // below has no styles, so it can't be clicked). Only clicks aimed at the
  // backdrop itself count, not clicks inside the content.
  const handleBackdropClick = (e) => {
    if (fullSize && e.target === e.currentTarget) handleOverlayClick();
  };

  const modalClass = `volta-pop_over${fullSize ? ' pop_over-full' : ''}${open ? ' pop_over-open in' : ''}${className ? ` ${className}` : ''}`;

  return (
    <div
      className={modalClass}
      tabIndex="-1"
      role="dialog"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      onClick={handleBackdropClick}
    >
      {!fullSize && (
        <div className="inner-overlay" onClick={handleOverlayClick}></div>
      )}
      <div className="dialog content" role="document">
        {children}
      </div>
    </div>
  );
};

PopOver.propTypes = {
  // Show the popover
  open: PropTypes.bool,
  // Cover the window with the backdrop (true) or keep the content in place
  fullSize: PropTypes.bool,
  // Close on a click outside the content, and on Escape
  closeOnOverlayClick: PropTypes.bool,
  // Called when the popover asks to close
  handleClose: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
  'aria-label': PropTypes.string,
  'aria-labelledby': PropTypes.string
};

export default PopOver;
