import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import Icon from '../Icon';
import Overlay from '../Overlay';
import useEscapeKey from '../Overlay/useEscapeKey';
import './Dropdown.scss';

const Dropdown = ({
    // attachToTop,
    buttonComponent,
    children,
    className,
    label = null,
    onClick,
    onClose = null,
    open,
    showOverlay = true,
    constrainWidth,
    ...otherProps
  }) => {

  const rootRef = useRef(null);
  const wasOpen = useRef(false);
  const [openState, setOpenState] = useState(false);

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

  // Escape closes the dropdown from anywhere on the page
  useEscapeKey(close, isOpen);

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
      <div className="dropdown-contents" onClick={close}>
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
  constrainWidth: PropTypes.bool,
  label: PropTypes.node,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  showOverlay: PropTypes.bool
};

export default Dropdown;
