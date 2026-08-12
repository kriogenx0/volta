// ModalDialog
// Interactive Modal with header and buttons

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Modal from '../Modal/Modal';

import './ModalDialog.scss';

const ModalDialog = ({
  isOpen, hideHeader, inlineMode, className, okayEnabled, okayButtonLabel,
  closeOnOverlayClick, title, closeX, children, hideOkayButton, cancelButtonLabel,
  onOkay, onCancel
}) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    if (isOpen !== null) setOpen(isOpen);
  }, [isOpen]);

  const close = () => setOpen(false);

  const handleOkay = () => {
    if (onOkay) onOkay();
    close();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    close();
  };

  const dialogClass = 'volta-modal_dialog ' + (hideHeader ? ' hide-header' : '') + (inlineMode ? ' inline-mode' : '') + (className ? " " + className : '');

  const okayButtonClass = "btn btn-primary okay-button" + (okayEnabled ? '' : ' disabled');
  const okayButton = (
    <button type="button"
      className={okayButtonClass}
      onClick={handleOkay}
    >
      {okayButtonLabel}
    </button>
  );

  const modalProps = {
    isOpen: open,
    className: dialogClass,
    closeOnOverlayClick
  };

  return (
    <Modal {...modalProps}>
      {hideHeader || !title ? null : (
        <div className="modal_dialog-header">
          {closeX ? (
            <a className='modal-x' aria-label="Close" onClick={handleCancel}>
              <i className="fa fa-times" aria-hidden="true"></i>
            </a>
          ) : null}
          <h4 className="modal_dialog-title">{title}</h4>
        </div>
      )}
      <div className="modal_dialog-body">
        {children}
      </div>
      <div className="modal_dialog-footer">
        {!hideOkayButton ? okayButton : null}
        <button type="button"
                className="btn btn-default cancel-button"
                data-dismiss="modal"
                onClick={handleCancel}>{cancelButtonLabel}</button>
      </div>
    </Modal>
  );
};

ModalDialog.defaultProps = {
  isOpen: null,
  closeX: false,
  closeOnOverlayClick: true,
  title: null,
  cancelButtonLabel: 'Cancel',
  okayButtonLabel: 'OK',
  okayEnabled: true,
  hideOkayButton: false,
  hideHeader: false,
  inlineMode: false
};

ModalDialog.propTypes = {
  onOkay: PropTypes.func,
  onCancel: PropTypes.func
};

export default ModalDialog;
