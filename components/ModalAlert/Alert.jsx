// A centered confirm/prompt dialog.
import { useEffect, useId, useRef } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button/Button';
import useModalBehavior from '../Overlay/useModalBehavior';

import './_alert.scss';

// Shown while it is rendered, so the parent decides when (render it
// conditionally). Confirm and Cancel call `onConfirm` / `onCancel`; with
// `type="input"` there's a text field and `onConfirm` receives its value
// (otherwise null). Enter confirms and Escape cancels. While it is shown the
// page behind doesn't scroll, Tab stays inside it, and focus returns to where
// it was when it goes away.
const Alert = ({
  title, message, type = 'text', confirmTitle = 'Confirm', cancelTitle = 'Cancel',
  onCancel = () => {}, onConfirm = () => {}
}) => {
  const inputRef = useRef(null);
  const rootRef = useRef(null);
  const titleId = useId();
  const messageId = useId();

  const handleCancel = (e) => {
    if (e) e.preventDefault();
    onCancel();
  };

  const handleConfirm = (e) => {
    if (e) e.preventDefault();
    onConfirm(type === 'input' ? inputRef.current.value : null);
  };

  // Before the focus trap's own effect, so a prompt's input gets the focus.
  useEffect(() => {
    if (type === 'input' && inputRef.current) inputRef.current.focus();
  }, [type]);

  useModalBehavior(rootRef);

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
    <div
      className="volta-alert lrt l-v-spaced v-centered-fixed-canvas"
      ref={rootRef}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={message ? messageId : undefined}
    >
      <div className="lrt_container">
        <h2 className="lrt_title l-v-bottom-spaced" id={titleId}>{title}</h2>
        {message && <p className="lrt_message l-v-bottom-spaced" id={messageId}>{message}</p>}
        {type === 'input' && (
          <input
            className="txt l-full-width l-v-bottom-spaced"
            ref={inputRef}
            aria-labelledby={message ? messageId : titleId}
          />
        )}
        <div className="lrt_buttons">
          <Button variant="primary" className="btn-primary" onClick={handleConfirm}>{confirmTitle}</Button>
          <Button onClick={handleCancel}>{cancelTitle}</Button>
        </div>
      </div>
    </div>
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
