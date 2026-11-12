// A centered confirm/prompt dialog: a confirmation Dialog (which is a Modal) with a message
// and, for a prompt, a text field.
import { useEffect, useId, useState } from 'react';
import PropTypes from 'prop-types';

import Dialog from '../Dialog/Dialog';
import TextBox from '../TextBox/TextBox';

// Shown while it is rendered, so the parent decides when (render it
// conditionally). Confirm and Cancel call `onConfirm` / `onCancel`; with
// `type="input"` there's a text field and `onConfirm` receives its value
// (otherwise null). Enter confirms and Escape cancels. The Dialog and Modal under it keep
// the page behind from scrolling, hold Tab inside, and return focus to where it was
// when it goes away. A click outside does not close it.
const Alert = ({
  title, message, type = 'text', confirmTitle = 'Confirm', cancelTitle = 'Cancel',
  onCancel = () => {}, onConfirm = () => {}
}) => {
  const [text, setText] = useState('');
  const messageId = useId();
  const inputId = useId();

  const handleCancel = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    onCancel();
  };

  const handleConfirm = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    onConfirm(type === 'input' ? text : null);
  };

  // A prompt's text field takes the focus (the Dialog under it would put it on Cancel)
  useEffect(() => {
    if (type === 'input') document.getElementById(inputId)?.focus();
  }, [type, inputId]);

  // keydown, not keyup: pressing Enter on the button that opened the alert fires
  // its click on keydown, and the matching keyup would otherwise confirm the
  // alert the moment it appears. A key held down (repeat) and Enter on one of
  // the alert's own buttons (which handle it as a click) are ignored.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.key === 'Escape') handleCancel();
      if (e.key === 'Enter' && !(e.target.closest && e.target.closest('a, button'))) handleConfirm();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <Dialog
      isOpen
      variant="confirmation"
      autoClose={false}
      className="volta-alert"
      title={title}
      titleSave={confirmTitle}
      titleCancel={cancelTitle}
      handleSave={handleConfirm}
      handleClose={handleCancel}
    >
      {message && <p className="alert-message" id={messageId}>{message}</p>}
      {type === 'input' && (
        <TextBox
          id={inputId}
          className="alert-input"
          value={text}
          aria-labelledby={message ? messageId : undefined}
          aria-label={message ? undefined : title}
          onChange={(event) => setText(event.target.value)}
        />
      )}
    </Dialog>
  );
};

Alert.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.oneOf(['text', 'input']),
  confirmTitle: PropTypes.string,
  cancelTitle: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
};

export default Alert;
