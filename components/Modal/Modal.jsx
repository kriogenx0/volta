import Overlay from "../Overlay";

import './Modal.scss';

const Modal = ({ show, onHide, children, className, headerTitle, ...otherProps }) => {

  return (
    <Overlay showing={show}>
      <div className={'v-modal' + (className ? ' ' + className : '')} show={show} size="lg" onHide={onHide} {...otherProps}>

        <div className="modal-dialog">

          {headerTitle && <div className="modal-header" closeButton>
            <div className="modal-title">{headerTitle}</div>
          </div>}

          <div className="modal-body modal-insides">
            <div className="modal-inside">
              {children}
            </div>
          </div>
        </div>

      </div>
    </Overlay>
  );
};

Modal.inside = ({ children }) => <div className="modal-inside--padding">{children}</div>;

export default Modal;
