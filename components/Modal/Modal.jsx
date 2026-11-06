import { useId, useRef } from 'react';
import PropTypes from 'prop-types';

import CloseButton from '../CloseButton/CloseButton';
import useEscapeKey from '../Overlay/useEscapeKey';
import useModalBehavior from '../Overlay/useModalBehavior';

import './Modal.scss';

// A dimmed backdrop with a centered panel, in one of two forms:
// - Standalone (`title` and/or `onClose` given): a titled panel with a close
//   button. It is open unless `show` is false; `onClose` is called by the
//   close button, a click on the backdrop and Escape.
// - Container (neither given): wraps `children` in a panel, shown while `show`
//   is true. `onHide` is called by a click on the backdrop and Escape. This is
//   the form ModalDialog builds on.
// While open it is modal: the page behind doesn't scroll, Tab stays inside the
// panel, and focus returns to where it was on closing. `modal={false}` turns
// that off, for a modal shown in the page flow instead of over it.
const Modal = ({ show, onHide, onClose, children, className, headerTitle, title, modal = true, ...otherProps }) => {
  const titleId = useId();
  const panelRef = useRef(null);
  const standalone = Boolean(title || onClose);
  const open = standalone ? show !== false : Boolean(show);

  useEscapeKey(standalone ? onClose : onHide, open);
  useModalBehavior(panelRef, open && modal);

  if (!open) return null;

  if (standalone) {
    return (
      <div className="volta-modal volta-modal--standalone" onClick={onClose}>
        <div
          className={`volta-modal-panel${className ? ` ${className}` : ''}`}
          ref={panelRef}
          role="dialog"
          aria-modal={modal ? 'true' : undefined}
          aria-labelledby={title ? titleId : undefined}
          tabIndex={-1}
          onClick={(event) => event.stopPropagation()}
          {...otherProps}
        >
          <div className="volta-modal-header">
            <h2 className="volta-modal-title" id={titleId}>{title}</h2>
            <CloseButton size="sm" onClick={onClose} />
          </div>
          {children}
        </div>
      </div>
    );
  }

  // Only a click on the backdrop itself hides the modal, not one inside the panel.
  const handleBackdropClick = (event) => {
    if (onHide && event.target === event.currentTarget) onHide();
  };

  return (
    <div className={`volta-modal${className ? ` ${className}` : ''}`} onClick={handleBackdropClick} {...otherProps}>
      <div
        className="modal-dialog volta-modal-panel"
        ref={panelRef}
        role="dialog"
        aria-modal={modal ? 'true' : undefined}
        aria-label={typeof headerTitle === 'string' ? headerTitle : undefined}
        tabIndex={-1}
      >
        {headerTitle && <div className="modal-header"><div className="modal-title">{headerTitle}</div></div>}
        <div className="modal-body modal-insides"><div className="modal-inside">{children}</div></div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onClose: PropTypes.func,
  title: PropTypes.node,
  headerTitle: PropTypes.node,
  className: PropTypes.string,
  // Lock page scroll and trap focus while open (default). Turn off for a modal in the page flow.
  modal: PropTypes.bool,
  children: PropTypes.node
};

Modal.inside = ({ children }) => <div className="modal-inside--padding">{children}</div>;

export { Modal };
export default Modal;
