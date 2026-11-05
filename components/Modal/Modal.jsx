import { useId } from 'react';
import PropTypes from 'prop-types';

import useEscapeKey from '../Overlay/useEscapeKey';

import './Modal.scss';

// A dimmed backdrop with a centered panel, in one of two forms:
// - Standalone (`title` and/or `onClose` given): a titled panel with a close
//   button. It is open unless `show` is false; `onClose` is called by the
//   close button, a click on the backdrop and Escape.
// - Container (neither given): wraps `children` in a panel, shown while `show`
//   is true. `onHide` is called by a click on the backdrop and Escape. This is
//   the form ModalDialog builds on.
const Modal = ({ show, onHide, onClose, children, className, headerTitle, title, ...otherProps }) => {
  const titleId = useId();
  const standalone = Boolean(title || onClose);
  const open = standalone ? show !== false : Boolean(show);

  useEscapeKey(standalone ? onClose : onHide, open);

  if (!open) return null;

  if (standalone) {
    return (
      <div className="volta-modal volta-modal--standalone" onClick={onClose}>
        <div
          className={`volta-modal-panel${className ? ` ${className}` : ''}`}
          role="dialog"
          aria-labelledby={title ? titleId : undefined}
          onClick={(event) => event.stopPropagation()}
          {...otherProps}
        >
          <div className="volta-modal-header">
            <h2 className="volta-modal-title" id={titleId}>{title}</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="volta-modal-close">×</button>
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
        role="dialog"
        aria-label={typeof headerTitle === 'string' ? headerTitle : undefined}
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
  children: PropTypes.node
};

Modal.inside = ({ children }) => <div className="modal-inside--padding">{children}</div>;

export { Modal };
export default Modal;
