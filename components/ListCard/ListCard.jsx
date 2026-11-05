import React from 'react';
import PropTypes from 'prop-types';

import './ListCard.scss';

const ListCard = ({ children }) => <div className="volta-list_card">{children}</div>;

const ListCardRow = ({ as = 'button', onClick, className = '', children }) => {
  const classes = `volta-list_card-row ${className}`.trim();
  return as === 'div'
    ? <div className={classes}>{children}</div>
    : <button type="button" onClick={onClick} className={`${classes} volta-list_card-row--action`}>{children}</button>;
};

ListCard.propTypes = {
  children: PropTypes.node
};

ListCardRow.propTypes = {
  // 'button' (default) is clickable; 'div' is a static row
  as: PropTypes.oneOf(['button', 'div']),
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
};

export { ListCard, ListCardRow };
export default ListCard;
