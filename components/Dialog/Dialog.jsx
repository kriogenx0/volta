// Dialog
// Interactive Modal with header and buttons

import { useState, useEffect, useId } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button/Button';
import PopOver from '../PopOver/PopOver';

import './Dialog.scss';

// Opens with `isOpen`. Cancel, the header close button and (with
// `closeOnOverlayClick`) a click outside call `handleClose`; Save calls
// `handleSave`. Each also closes the dialog, so a parent that keeps its own open
// state should update it in those callbacks to be able to reopen it.
const Dialog = ({
  isOpen = false, saveEnabled = true, hideSaveButton = false, inlineMode = false, hideHeader = false, title = null,
  className, handleSave: onSave, handleClose: onCloseProp, titleSave = 'Save Changes', titleCancel = 'Cancel',
  closeOnOverlayClick = false, children
}) => {
  const titleId = useId();
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

  const showHeader = !hideHeader && Boolean(title);

  var dialogClass = 'volta-dialog ' + (hideHeader ? ' hide-header' : '') + (inline ? ' inline-mode' : '');
  if (className) dialogClass += " " + className;
  // btn-primary / btn-default are kept for the host app's own button styles
  var saveButton = hideSave ? null : (
    <Button variant="primary"
      className="btn-primary save-button"
      disabled={!enabled}
      onClick={handleSave}>{titleSave}</Button>
  );

  let basicModalProps = {
    open,
    className: dialogClass,
    closeOnOverlayClick,
    handleClose,
    'aria-labelledby': showHeader ? titleId : undefined
  };

  return (
    <PopOver {...basicModalProps}>
    {showHeader ? (
      <div className="dialog-header">
        <button type="button"
                className="close"
                data-dismiss="dialog"
                aria-label="Close"
                onClick={handleClose}>
        <span aria-hidden="true">&times;</span>
        </button>
        <h4 className="dialog-title" id={titleId}>{title}</h4>
      </div>
    ) : null}
    <div className="dialog-body">
      {children}
    </div>
    <div className="dialog-footer">
      {saveButton}
      <Button className="btn-default cancel-button"
              data-dismiss="modal"
              onClick={handleClose}>{titleCancel}</Button>
    </div>
    </PopOver>
  );
};

Dialog.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  titleSave: PropTypes.string,
  titleCancel: PropTypes.string,
  saveEnabled: PropTypes.bool,
  hideSaveButton: PropTypes.bool,
  hideHeader: PropTypes.bool,
  // Show in the page flow instead of floating over it
  inlineMode: PropTypes.bool,
  // Close on a click outside the dialog, and on Escape
  closeOnOverlayClick: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  handleSave: PropTypes.func,
  handleClose: PropTypes.func
};

export default Dialog;
