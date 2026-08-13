import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

import CloseButton from '../CloseButton';
import Icon from '../Icon';

import './ToastMessage.scss';

const DEFAULT_DURATION = 4000;

const VARIANT_ICONS = {
  info: 'infocircle',
  success: 'checkcircle',
  warning: 'exclamation',
  error: 'exclamationsolid'
};

let nextId = 0;
let toasts = [];
let listeners = [];
let root = null;

const notify = () => listeners.forEach((listener) => listener(toasts));

const dismiss = (id) => {
  toasts = toasts.filter((toast) => toast.id !== id);
  notify();
};

const mount = () => {
  if (root) return;
  const el = document.createElement('div');
  el.className = 'volta-toast_message_root';
  document.body.appendChild(el);
  root = createRoot(el);
  root.render(<ToastMessageContainer />);
};

const show = (message, { variant = 'info', duration = DEFAULT_DURATION } = {}) => {
  const id = ++nextId;
  toasts = [{ id, message, variant, duration }, ...toasts];
  mount();
  notify();
  return id;
};

const ToastMessageItem = ({ id, message, variant, duration, onRequestDismiss }) => {
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef(null);

  const clearTimer = () => clearTimeout(timerRef.current);
  const leave = useCallback(() => setLeaving(true), []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (!duration) return;
    timerRef.current = setTimeout(leave, duration);
  }, [duration, leave]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer]);

  return (
    <div
      className={`volta-toast_message volta-toast_message-${variant}${leaving ? ' is-leaving' : ''}`}
      role='status'
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
      onAnimationEnd={(event) => {
        if (leaving && event.animationName === 'volta-toast-message-leave') onRequestDismiss(id);
      }}
    >
      <Icon type={VARIANT_ICONS[variant]} />
      <div className='volta-toast_message-text'>{message}</div>
      <CloseButton onClick={leave} aria-label='Dismiss' />
    </div>
  );
};

const ToastMessageContainer = () => {
  const [items, setItems] = useState(toasts);

  useEffect(() => {
    listeners.push(setItems);
    return () => {
      listeners = listeners.filter((listener) => listener !== setItems);
    };
  }, []);

  if (!items.length) return null;

  return (
    <div className='volta-toast_message_container'>
      {items.map((item) => (
        <ToastMessageItem key={item.id} {...item} onRequestDismiss={dismiss} />
      ))}
    </div>
  );
};

const ToastMessage = {
  show,
  dismiss,
  success: (message, opts) => show(message, { ...opts, variant: 'success' }),
  error: (message, opts) => show(message, { ...opts, variant: 'error' }),
  warning: (message, opts) => show(message, { ...opts, variant: 'warning' }),
  info: (message, opts) => show(message, { ...opts, variant: 'info' })
};

export { ToastMessage };
export default ToastMessage;
