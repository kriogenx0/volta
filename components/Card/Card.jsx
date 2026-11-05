import PropTypes from 'prop-types';

import './Card.scss';

const Card = ({ selected, selectable, children, className = '', onClick, padding = 'md', ...otherProps }) => {
  const classes = [
    'volta-card',
    selectable && 'volta-card-selectable',
    selected && 'volta-card-selected',
    padding && `volta-card--${padding}`,
    className
  ].filter(Boolean).join(' ');

  return <div className={classes} onClick={onClick} {...otherProps}>{children}</div>;
};

Card.propTypes = {
  selected: PropTypes.bool,
  selectable: PropTypes.bool,
  onClick: PropTypes.func,
  padding: PropTypes.oneOf(['none', 'sm', 'md'])
};

export { Card };
export default Card;
