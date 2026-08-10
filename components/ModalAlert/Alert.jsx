// A centered confirm/prompt dialog.
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './_alert.scss';

const Alert = ({ title, message, type, confirmTitle, cancelTitle, onCancel, onConfirm }) => {
  const inputRef = useRef(null);

  const handleCancel = (e) => {
    if (e) e.preventDefault();
    onCancel();
  };

  const handleConfirm = (e) => {
    if (e) e.preventDefault();
    onConfirm(type === 'input' ? inputRef.current.value : null);
  };

  useEffect(() => {
    if (type === 'input' && inputRef.current) inputRef.current.focus();

    const handleKeyUp = (e) => {
      if (e.keyCode === 27) handleCancel();
      if (e.keyCode === 13) handleConfirm();
    };

    document.addEventListener('keyup', handleKeyUp);
    return () => document.removeEventListener('keyup', handleKeyUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="lrt l-v-spaced v-centered-fixed-canvas">
      <div className="lrt_container">
        <h2 className="lrt_title l-v-bottom-spaced">{title}</h2>
        <p className="lrt_message l-v-bottom-spaced">{message}</p>
        {type === 'input' && (
          <input className="txt l-full-width l-v-bottom-spaced" ref={inputRef} />
        )}
        <div className="lrt_buttons">
          <a href="#" className="btn btn-primary" onClick={handleConfirm}>{confirmTitle}</a>
          <a href="#" className="btn" onClick={handleCancel}>{cancelTitle}</a>
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

Alert.defaultProps = {
  confirmTitle: 'Confirm',
  cancelTitle: 'Cancel',
  type: 'text',
  onCancel: () => {},
  onConfirm: () => {}
};

export default Alert;
