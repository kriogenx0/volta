// Dialog
// Interactive Modal with header and buttons

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import PopOver from '../PopOver/PopOver';

import './Dialog.scss';

const Dialog = ({
  isOpen, saveEnabled, hideSaveButton, inlineMode, hideHeader, title,
  className, handleSave: onSave, handleClose: onCloseProp, titleSave, titleCancel, closeOnOverlayClick, children
}) => {
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

  var dialogClass = 'volta-dialog ' + (hideHeader ? ' hide-header' : '') + (inline ? ' inline-mode' : '');
  if (className) dialogClass += " " + className;
  var saveButtonClass = "btn btn-primary save-button" + (enabled ? '' : ' disabled');
  var saveButton = hideSave ? null : (<button type="button"
    className={saveButtonClass}
    onClick={handleSave}>{titleSave}</button>);

  let basicModalProps = {
    open,
    className: dialogClass,
    closeOnOverlayClick,
    handleClose: onCloseProp
  };

  return (
    <PopOver {...basicModalProps}>
    {hideHeader || !title ? null : (
      <div className="dialog-header">
        <button type="button"
                className="close"
                data-dismiss="dialog"
                aria-label="Close"
                onClick={handleClose}>
        <span aria-hidden="true">&times;</span>
        </button>
        <h4 className="dialog-title">{title}</h4>
      </div>
    )}
    <div className="dialog-body">
      {children}
    </div>
    <div className="dialog-footer">
      {saveButton}
      <button type="button"
              className="btn btn-default cancel-button"
              data-dismiss="modal"
              onClick={handleClose}>{titleCancel}</button>
    </div>
    </PopOver>
  );
};

Dialog.defaultProps = {
  isOpen: false,
  closeOnOverlayClick: false,
  title: null,
  titleCancel: 'Cancel',
  titleSave: 'Save Changes',
  saveEnabled: true,
  hideSaveButton: false,
  hideHeader: false,
  inlineMode: false
};

Dialog.propTypes = {
  handleSave: PropTypes.func,
  handleClose: PropTypes.func
};

export default Dialog;
