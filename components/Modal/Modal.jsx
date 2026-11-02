import Overlay from '../Overlay';

import './Modal.scss';

const Modal = ({ show, onHide, onClose, children, className, headerTitle, title, ...otherProps }) => {
  if (title || onClose) {
    return (
      <div className="volta-modal volta-modal--standalone" onClick={onClose}>
        <div className={`volta-modal-panel${className ? ` ${className}` : ''}`} onClick={(event) => event.stopPropagation()} {...otherProps}>
          <div className="volta-modal-header">
            <h2 className="volta-modal-title">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="volta-modal-close">×</button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  return (
    <Overlay showing={show}>
      <div className={`volta-modal${className ? ` ${className}` : ''}`} show={show} size="lg" onHide={onHide} {...otherProps}>
        <div className="modal-dialog">
          {headerTitle && <div className="modal-header"><div className="modal-title">{headerTitle}</div></div>}
          <div className="modal-body modal-insides"><div className="modal-inside">{children}</div></div>
        </div>
      </div>
    </Overlay>
  );
};

Modal.inside = ({ children }) => <div className="modal-inside--padding">{children}</div>;

export { Modal };
export default Modal;
