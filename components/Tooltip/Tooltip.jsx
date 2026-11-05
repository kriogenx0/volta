import { useState, useId } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Tooltip.scss';

// Wraps its children and shows `title` next to them on hover or keyboard focus.
// Defaults are default parameters, not defaultProps, which React 19 ignores on
// function components.
const Tooltip = ({ title = null, gravity = 'up', className = null, children, margin = 8, ...rest }) => {
  const id = useId();
  const [visible, setVisible] = useState(false);

  const show = () => {
    if (title) setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  const open = Boolean(visible && title);

  return (
    <span
      {...rest}
      className={classnames('volta-tooltip_wrap', className)}
      aria-describedby={open ? id : undefined}
      onMouseOver={show}
      onMouseOut={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {open && (
        <div id={id} role="tooltip" className={classnames('volta-tooltip', gravity)} style={{ '--v-tooltip-gap': `${margin}px` }}>
          <div className="tooltip-body">{title}</div>
        </div>
      )}
    </span>
  );
};

Tooltip.propTypes = {
  title: PropTypes.string,
  gravity: PropTypes.oneOf(['up', 'down', 'left', 'right']),
  className: PropTypes.string,
  margin: PropTypes.number,
  children: PropTypes.node
};

export default Tooltip;
