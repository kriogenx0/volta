// Dialog
// A Modal with a header, a body and a row of buttons.

import { useState, useEffect, useId } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button/Button';
import CloseButton from '../CloseButton/CloseButton';
import Modal from '../Modal/Modal';

import './Dialog.scss';

// Opens with `isOpen`. Cancel, the header close button and (with
// `closeOnOverlayClick`) a click outside call `handleClose`; Save calls
// `handleSave`. Each also closes the dialog, so a parent that keeps its own open
// state should update it in those callbacks to be able to reopen it.
//
// `variant="confirmation"` is a short question with a Confirm and a Cancel button, for
// a decision (delete this? leave without saving?). It is narrower, has no close X, is
// announced as an alert dialog, and with `danger` the Confirm button is the danger red.
// The Cancel button has focus when it opens, so Enter never confirms by accident.
const Dialog = ({
  isOpen = false, saveEnabled = true, hideSaveButton = false, inlineMode = false, hideHeader = false, title = null,
  className, handleSave: onSave, handleClose: onCloseProp, titleSave, titleCancel = 'Cancel',
  closeOnOverlayClick = false, variant = 'form', danger = false, showCloseButton = true, children
}) => {
  const titleId = useId();
  const bodyId = useId();
  const confirmation = variant === 'confirmation';
  const saveLabel = titleSave !== undefined ? titleSave : (confirmation ? 'Confirm' : 'Save Changes');

  const [open, setOpen] = useState(isOpen);
  const [enabled, setEnabled] = useState(saveEnabled);
  const [hideSave, setHideSave] = useState(hideSaveButton);
  const [inline, setInline] = useState(inlineMode);

  useEffect(() => {
    setOpen(isOpen);
    setEnabled(saveEnabled);
    setHideSave(hideSaveButton);
    setInline(inlineMode);
  }, [isOpen, saveEnabled, hideSaveButton, inlineMode]);

  const closeDialog = () => setOpen(false);

  const handleSave = () => {
    if (onSave) onSave();
    closeDialog();
  };

  const handleClose = () => {
    if (onCloseProp) onCloseProp();
    closeDialog();
  };

  // A confirmation is its question: it always has a title to read out
  const showHeader = !hideHeader && Boolean(title);

  var dialogClass = 'volta-dialog ' + (hideHeader ? ' hide-header' : '') + (inline ? ' inline-mode' : '') + (confirmation ? ' dialog-confirmation' : '');
  if (className) dialogClass += " " + className;
  // btn-primary / btn-default are kept for the host app's own button styles
  var saveButton = hideSave ? null : (
    <Button variant={danger ? 'danger' : 'primary'}
      className={`${danger ? 'btn-danger' : 'btn-primary'} save-button`}
      disabled={!enabled}
      onClick={handleSave}>{saveLabel}</Button>
  );

  return (
    <Modal
      open={open}
      // In the page flow it isn't over anything, so nothing to lock or trap
      modal={!inline}
      className={dialogClass}
      closeOnOverlayClick={closeOnOverlayClick}
      handleClose={handleClose}
      aria-labelledby={showHeader ? titleId : undefined}
      aria-describedby={confirmation ? bodyId : undefined}
      role={confirmation ? 'alertdialog' : undefined}
    >
      {showHeader ? (
        <div className="dialog-header">
          {!confirmation && showCloseButton && <CloseButton size="sm" className="close" data-dismiss="dialog" onClick={handleClose} />}
          <h4 className="dialog-title" id={titleId}>{title}</h4>
        </div>
      ) : null}
      <div className="dialog-body" id={confirmation ? bodyId : undefined}>
        {children}
      </div>
      <div className="dialog-footer">
        {saveButton}
        <Button className="btn-default cancel-button"
                data-dismiss="modal"
                autoFocus={confirmation}
                onClick={handleClose}>{titleCancel}</Button>
      </div>
    </Modal>
  );
};

Dialog.variants = ['form', 'confirmation'];

Dialog.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  // The Save button's label: 'Save Changes', or 'Confirm' in a confirmation
  titleSave: PropTypes.string,
  titleCancel: PropTypes.string,
  saveEnabled: PropTypes.bool,
  hideSaveButton: PropTypes.bool,
  hideHeader: PropTypes.bool,
  // Show in the page flow instead of floating over it
  inlineMode: PropTypes.bool,
  // Close on a click outside the dialog, and on Escape
  closeOnOverlayClick: PropTypes.bool,
  // 'form' is the usual titled dialog; 'confirmation' is a short question with Confirm and Cancel
  variant: PropTypes.oneOf(Dialog.variants),
  // Make the Save or Confirm button the danger red, for a destructive choice
  danger: PropTypes.bool,
  // The X in the header (never in a confirmation)
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  handleSave: PropTypes.func,
  handleClose: PropTypes.func
};

// ModalDialog is a Dialog under its older names, kept for existing callers: OK and
// Cancel (okayButtonLabel, cancelButtonLabel), onOkay and onCancel, the X in the
// header only with closeX, and a click outside cancels by default.
const ModalDialog = ({
  isOpen = null, okayEnabled = true, okayButtonLabel = 'OK', hideOkayButton = false, cancelButtonLabel = 'Cancel',
  closeOnOverlayClick = true, closeX = false, onOkay, onCancel, ...props
}) => (
  <Dialog
    isOpen={Boolean(isOpen)}
    saveEnabled={okayEnabled}
    titleSave={okayButtonLabel}
    hideSaveButton={hideOkayButton}
    titleCancel={cancelButtonLabel}
    closeOnOverlayClick={closeOnOverlayClick}
    handleSave={onOkay}
    handleClose={onCancel}
    showCloseButton={closeX}
    {...props}
  />
);

export { Dialog, ModalDialog };
export default Dialog;
