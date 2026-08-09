import { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './Tooltip.scss';

const Tooltip = ({ title, gravity, className, children, margin, ...rest }) => {
  const [visible, setVisible] = useState(false);

  const handleMouseOver = () => {
    if (title) setVisible(true);
  };

  const handleMouseOut = () => {
    setVisible(false);
  };

  return (
    <span
      {...rest}
      className={classnames('c-tooltip_wrap', className)}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {children}
      {visible && title && (
        <div className={classnames('c-tooltip', gravity)} style={{ '--v-tooltip-gap': `${margin}px` }}>
          <div className="tooltip-body">{title}</div>
        </div>
      )}
    </span>
  );
};

Tooltip.defaultProps = {
  title: null,
  gravity: 'up',
  className: null,
  margin: 8
};

Tooltip.propTypes = {
  title: PropTypes.string,
  gravity: PropTypes.oneOf(['up', 'down', 'left', 'right']),
  className: PropTypes.string,
  margin: PropTypes.number
};

export default Tooltip;
