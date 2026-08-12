import PropTypes from 'prop-types';

import './Card.scss';

const PADDING_CLASS = { none: '', sm: 'p-3', md: 'p-4' };

const Card = ({ selected, selectable, children, className = '', onClick, padding, ...otherProps }) => {
  const classes = [
    'volta-card',
    selectable && 'volta-card-selectable',
    selected && 'volta-card-selected',
    padding && 'rounded-lg border border-gray-200 dark:border-gray-800',
    padding && PADDING_CLASS[padding],
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

Card.defaultProps = { padding: 'md' };

export { Card };
export default Card;
