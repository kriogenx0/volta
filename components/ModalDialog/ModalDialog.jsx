// ModalDialog
// Interactive Modal with header and buttons

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button/Button';
import Modal from '../Modal/Modal';

import './ModalDialog.scss';

// Opens with `isOpen` (leave it null to keep it closed). OK and Cancel (and the
// X) call `onOkay` / `onCancel`, then close the dialog; with `closeOnOverlayClick`
// a click on the backdrop or Escape cancels. A parent that keeps its own open
// state should update it in those callbacks to be able to reopen it.
const ModalDialog = ({
  isOpen = null, hideHeader = false, inlineMode = false, className, okayEnabled = true, okayButtonLabel = 'OK',
  closeOnOverlayClick = true, title = null, closeX = false, children, hideOkayButton = false,
  cancelButtonLabel = 'Cancel', onOkay, onCancel
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

  // btn-primary / btn-default are kept for the host app's own button styles
  const okayButton = (
    <Button variant="primary"
      className="btn-primary okay-button"
      disabled={!okayEnabled}
      onClick={handleOkay}
    >
      {okayButtonLabel}
    </Button>
  );

  const modalProps = {
    show: Boolean(open),
    className: dialogClass,
    onHide: closeOnOverlayClick ? handleCancel : undefined
  };

  return (
    <Modal {...modalProps}>
      {hideHeader || !title ? null : (
        <div className="modal_dialog-header">
          {closeX ? (
            <button type="button" className='modal-x' aria-label="Close" onClick={handleCancel}>
              <span aria-hidden="true">&times;</span>
            </button>
          ) : null}
          <h4 className="modal_dialog-title">{title}</h4>
        </div>
      )}
      <div className="modal_dialog-body">
        {children}
      </div>
      <div className="modal_dialog-footer">
        {!hideOkayButton ? okayButton : null}
        <Button className="btn-default cancel-button"
                data-dismiss="modal"
                onClick={handleCancel}>{cancelButtonLabel}</Button>
      </div>
    </Modal>
  );
};

ModalDialog.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  okayButtonLabel: PropTypes.string,
  cancelButtonLabel: PropTypes.string,
  okayEnabled: PropTypes.bool,
  hideOkayButton: PropTypes.bool,
  hideHeader: PropTypes.bool,
  // Show an X button in the header
  closeX: PropTypes.bool,
  // Show in the page flow instead of floating over it
  inlineMode: PropTypes.bool,
  // Cancel on a click on the backdrop, and on Escape
  closeOnOverlayClick: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  onOkay: PropTypes.func,
  onCancel: PropTypes.func
};

export default ModalDialog;
