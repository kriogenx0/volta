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
//   (or `open`) is true. `onHide` (or `handleClose`) is called by a click on the
//   backdrop and Escape. Dialog builds on this form.
// While open it is modal: the page behind doesn't scroll, Tab stays inside the
// panel, and focus returns to where it was on closing. `modal={false}` turns
// that off, for a modal shown in the page flow instead of over it.
//
// `fullSize={false}` keeps the panel where it is in the page, over a faint
// click-catcher, instead of centering it on a backdrop (and it is then not modal
// unless asked). That was PopOver, which is now this component with those names.
// `closeOnOverlayClick={false}` turns off closing from a click outside and from
// Escape.
const Modal = ({
  show, open: openProp, onHide, onClose, handleClose, children, className, headerTitle, title,
  modal, closeOnOverlayClick = true, fullSize = true,
  role, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, 'aria-describedby': ariaDescribedby, ...otherProps
}) => {
  const titleId = useId();
  const panelRef = useRef(null);
  const standalone = Boolean(title || onClose);
  const shown = openProp !== undefined ? openProp : show;
  const open = standalone ? shown !== false : Boolean(shown);
  const isModal = modal !== undefined ? modal : fullSize;
  const close = onClose || onHide || handleClose;
  const dismiss = closeOnOverlayClick && close ? close : undefined;

  useEscapeKey(dismiss, open);
  useModalBehavior(panelRef, open && isModal);

  if (!open) return null;

  if (standalone) {
    return (
      <div className="volta-modal volta-modal--standalone" onClick={dismiss}>
        <div
          className={`volta-modal-panel${className ? ` ${className}` : ''}`}
          ref={panelRef}
          role={role || 'dialog'}
          aria-modal={isModal ? 'true' : undefined}
          aria-labelledby={ariaLabelledby || (title ? titleId : undefined)}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
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
    if (fullSize && dismiss && event.target === event.currentTarget) dismiss();
  };

  return (
    <div
      className={`volta-modal${fullSize ? '' : ' volta-modal--inline'}${className ? ` ${className}` : ''}`}
      onClick={handleBackdropClick}
      {...otherProps}
    >
      {/* In place, the page behind is covered by a faint click-catcher, so a click outside closes it */}
      {!fullSize && <div className="volta-modal-catcher" onClick={dismiss} />}
      <div
        className="modal-dialog volta-modal-panel"
        ref={panelRef}
        role={role || 'dialog'}
        aria-modal={isModal ? 'true' : undefined}
        aria-label={ariaLabel || (typeof headerTitle === 'string' ? headerTitle : undefined)}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        tabIndex={-1}
      >
        {headerTitle && <div className="modal-header"><div className="modal-title">{headerTitle}</div></div>}
        <div className="modal-body modal-insides"><div className="modal-inside">{children}</div></div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  // Whether it is shown. `open` is another name for it.
  show: PropTypes.bool,
  open: PropTypes.bool,
  // Called when it asks to close (a click outside, Escape). `onHide` and `handleClose` are other names for it.
  onHide: PropTypes.func,
  onClose: PropTypes.func,
  handleClose: PropTypes.func,
  title: PropTypes.node,
  headerTitle: PropTypes.node,
  className: PropTypes.string,
  // Lock page scroll and trap focus while open. On by default, and off in place (fullSize={false}).
  modal: PropTypes.bool,
  // Cover the window with the backdrop (the default), or keep the panel where it is in the page
  fullSize: PropTypes.bool,
  // Close on a click outside the panel, and on Escape. On by default.
  closeOnOverlayClick: PropTypes.bool,
  // The panel's role: 'dialog' (the default), or 'alertdialog' for a question that needs an answer
  role: PropTypes.string,
  'aria-label': PropTypes.string,
  'aria-labelledby': PropTypes.string,
  'aria-describedby': PropTypes.string,
  children: PropTypes.node
};

Modal.inside = ({ children }) => <div className="modal-inside--padding">{children}</div>;

// PopOver is another name for Modal in its container form, kept for existing callers.
const PopOver = Modal;

export { Modal, PopOver };
export default Modal;
