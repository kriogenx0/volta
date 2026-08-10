import Overlay from '../Overlay';

import './Modal.scss';

const Modal = ({ show, onHide, onClose, children, className, headerTitle, title, ...otherProps }) => {
  if (title || onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
        <div className={`max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-5 shadow-xl dark:bg-gray-900 ${className || ''}`} onClick={(event) => event.stopPropagation()} {...otherProps}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">×</button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  return (
    <Overlay showing={show}>
      <div className={`v-modal${className ? ` ${className}` : ''}`} show={show} size="lg" onHide={onHide} {...otherProps}>
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
