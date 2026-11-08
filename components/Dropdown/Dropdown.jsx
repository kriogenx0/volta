import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import Icon from '../Icon';
import Overlay from '../Overlay';
import useEscapeKey from '../Overlay/useEscapeKey';
import { placePanel } from './placement';
import './Dropdown.scss';

// The panel opens below the trigger, or above it when it doesn't fit below. It
// closes on Escape, on a click outside it, and on a click on anything inside it
// marked `data-dropdown-close` (a choice); other clicks inside leave it open, so
// it can hold controls that are used more than once (paging a calendar, a form).
// `closeOnContentClick` closes on any click inside, as it used to.
const Dropdown = ({
    // attachToTop,
    buttonComponent,
    children,
    className,
    closeOnContentClick = false,
    label = null,
    onClick,
    onClose = null,
    open,
    showOverlay = true,
    constrainWidth,
    ...otherProps
  }) => {

  const rootRef = useRef(null);
  const contentsRef = useRef(null);
  const wasOpen = useRef(false);
  const [openState, setOpenState] = useState(false);
  const [placement, setPlacement] = useState('below');

  // Automanage open state unless the parent controls it with `open`
  const managed = typeof open == 'undefined';
  const isOpen = managed ? openState : open;

  const handleButtonClick = (e) => {
    if (managed) setOpenState((current) => !current);
    onClick && onClick(e);
  };

  const close = useCallback((e) => {
    if (managed) setOpenState(false);
    onClose && onClose(e);
  }, [managed, onClose]);

  // A click on a choice (an element marked data-dropdown-close) closes it; so
  // does any click inside, with closeOnContentClick.
  const handleContentsClick = (e) => {
    if (closeOnContentClick) {
      close(e);
      return;
    }
    const choice = e.target.closest && e.target.closest('[data-dropdown-close]');
    if (choice && e.currentTarget.contains(choice)) close(e);
  };

  // Escape closes the dropdown from anywhere on the page
  useEscapeKey(close, isOpen);

  // Without the overlay there is nothing to catch a click outside, so listen for
  // it. (With the overlay, a click on it closes the dropdown and goes no further.)
  useEffect(() => {
    if (!isOpen || showOverlay) return undefined;

    const handlePointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close(e);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen, showOverlay, close]);

  // Below the trigger unless that runs off the window and there is more room above.
  useLayoutEffect(() => {
    if (!isOpen || !rootRef.current || !contentsRef.current) return;

    const trigger = rootRef.current.getBoundingClientRect();
    setPlacement(placePanel({
      triggerTop: trigger.top,
      triggerBottom: trigger.bottom,
      panelHeight: contentsRef.current.offsetHeight,
      viewportHeight: window.innerHeight
    }));
  }, [isOpen]);

  // After it closes, put focus back on the trigger unless the user has already
  // moved on to something outside the dropdown.
  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      const active = document.activeElement;
      const root = rootRef.current;
      if (root && (!active || active === document.body || root.contains(active))) {
        const trigger = root.firstElementChild;
        if (trigger && !trigger.classList.contains('dropdown-contents')) trigger.focus();
      }
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  const cls = 'volta-dropdown'
    + (className ? ` ${className}` : '')
    + (isOpen ? ' is-open' : '')
    + (constrainWidth ? ' dropdown-constrain_width' : '');

  if (typeof buttonComponent == 'undefined') {
    buttonComponent = (
      <Button aria-haspopup="true" aria-expanded={Boolean(isOpen)} {...otherProps} onClick={handleButtonClick}>
        <span className='dropdown-label'>{label}</span>
        <Icon type="chevron.down" size="small" aria-hidden="true" />
      </Button>
    );
  }

  return (
    <div className={cls} ref={rootRef}>
      { buttonComponent }
      <div
        className={`dropdown-contents${placement === 'above' ? ' dropdown-contents--above' : ''}`}
        ref={contentsRef}
        onClick={handleContentsClick}
      >
        {children}
      </div>
      { showOverlay && <Overlay showing={isOpen} onClick={close} /> }
    </div>
  );
}

Dropdown.propTypes = {
  // When `open` is a bool the parent controls the dropdown (onClick and onClose
  // toggle it); when it is left out the dropdown opens and closes itself.
  open: PropTypes.bool,
  buttonComponent: PropTypes.element,
  children: PropTypes.node,
  className: PropTypes.string,
  // Close on any click inside the panel, not only on a data-dropdown-close element
  closeOnContentClick: PropTypes.bool,
  constrainWidth: PropTypes.bool,
  label: PropTypes.node,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  showOverlay: PropTypes.bool
};

export default Dropdown;
