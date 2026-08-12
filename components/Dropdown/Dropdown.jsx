import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import Icon from '../Icon';
import Overlay from '../Overlay';
import './Dropdown.scss';

const Dropdown = ({
    // attachToTop,
    buttonComponent,
    children,
    className,
    label,
    onClick,
    onClose,
    open,
    showOverlay,
    constrainWidth,
    ...otherProps
  }) => {

  // Automanage open state
  let handleButtonClick;
  if (typeof open == 'undefined') {
    let [open, setOpen] = useState(false);

    onClose = () => {
      setOpen(false);
    };

    handleButtonClick = (e) => {
      setOpen(true);
      onClick(e);
    };
  } else {
    handleButtonClick = onClick;
  }

  const handleContentsClick = onClose;

  const cls = 'volta-dropdown'
    + (className ? ` ${className}` : '')
    + (open ? ' is-open' : '')
    + (constrainWidth ? ' dropdown-constrain_width' : '');

  if (typeof buttonComponent == 'undefined') {
    buttonComponent = (
      <Button {...otherProps} onClick={handleButtonClick}>
        <span className='dropdown-label'>{label}</span>
        <Icon type="chevron.down" size="small" />
      </Button>
    );
  }

  return (
    <div className={cls}>
      { buttonComponent }
      <div className="dropdown-contents" onClick={handleContentsClick}>
        {children}
      </div>
      { showOverlay && <Overlay showing={open} onClick={onClose} /> }
    </div>
  );
}

Dropdown.defaultProps = {
  // className,
  // buttonComponent,
  // open: false,
  label: null,
  onClose: null,
  showOverlay: true
};

Dropdown.propTypes = {
  // open: PropTypes.bool,
  buttonComponent: PropTypes.element,
  onClose: PropTypes.func,
  showOverlay: PropTypes.bool
};

export default Dropdown;
