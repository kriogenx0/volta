import { Children, cloneElement, isValidElement, useId, useState } from 'react';
import PropTypes from 'prop-types';

import Dropdown from '../Dropdown/Dropdown';

import './TextboxDropdown.scss';

// What can take focus: a press on one of these inside the panel moves focus there, which is
// fine; a press anywhere else in the panel must not take focus from the textbox.
const FOCUSABLE = 'input, select, textarea, button, a[href], [tabindex]';

// A textbox with a panel under it, as wide as the textbox: the shared part of a field that
// offers choices (a time, a colour, a date, a suggestion). The panel opens when the textbox
// gets focus or is clicked, and closes on Escape, on a click outside and the moment focus
// leaves the textbox and the panel. Pressing the panel's own text or whitespace does not take
// focus from the textbox, so the panel does not close under the pointer. It is a Dropdown with
// the textbox as its trigger, so it opens above when there is no room below.
//
// `textbox` is the field itself (a TextBox, or any element that takes `onFocus`, `onClick` and
// aria props); it is given `aria-expanded`, `aria-haspopup` and `aria-controls`.
const TextboxDropdown = ({
  textbox, children, open, onOpenChange, closeOnContentClick = false, panelRole = 'dialog', panelLabel, className
}) => {
  const [openState, setOpenState] = useState(false);
  const panelId = useId();
  const managed = typeof open === 'undefined';
  const isOpen = managed ? openState : open;

  const setOpen = (next) => {
    if (managed) setOpenState(next);
    if (onOpenChange && next !== isOpen) onOpenChange(next);
  };

  const field = Children.only(textbox);
  const trigger = isValidElement(field) ? cloneElement(field, {
    onFocus: (event) => { if (field.props.onFocus) field.props.onFocus(event); setOpen(true); },
    onClick: (event) => { if (field.props.onClick) field.props.onClick(event); setOpen(true); },
    'aria-expanded': isOpen,
    'aria-haspopup': panelRole,
    'aria-controls': panelId
  }) : field;

  // Focus leaving for somewhere outside the textbox and the panel closes it
  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  };

  const handleMouseDown = (event) => {
    if (event.target.closest && event.target.closest('.dropdown-contents') && !event.target.closest(FOCUSABLE)) event.preventDefault();
  };

  return (
    <div className={`volta-textbox_dropdown${className ? ` ${className}` : ''}`} onBlur={handleBlur} onMouseDown={handleMouseDown}>
      <Dropdown
        open={isOpen}
        buttonComponent={trigger}
        showOverlay={false}
        constrainWidth
        closeOnContentClick={closeOnContentClick}
        onClose={() => setOpen(false)}
      >
        <div id={panelId} role={panelRole} aria-label={panelLabel} className="textbox_dropdown-panel">
          {children}
        </div>
      </Dropdown>
    </div>
  );
};

TextboxDropdown.propTypes = {
  // The field the panel hangs from: one element, such as a TextBox
  textbox: PropTypes.element.isRequired,
  // The panel's contents
  children: PropTypes.node,
  // Controls it: whether the panel is showing. Leave it out and the panel opens and closes itself.
  open: PropTypes.bool,
  // Called with true or false when it asks to open or close
  onOpenChange: PropTypes.func,
  // Close on any click inside the panel (otherwise only on an element marked data-dropdown-close)
  closeOnContentClick: PropTypes.bool,
  // The panel's role: 'dialog' (the default), 'listbox' for a list of options, 'grid' ...
  panelRole: PropTypes.string,
  // Names the panel for assistive technology
  panelLabel: PropTypes.string,
  className: PropTypes.string
};

export { TextboxDropdown };
export default TextboxDropdown;
