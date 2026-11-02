import React from 'react';

import './ListCard.scss';

const ListCard = ({ children }) => <div className="volta-list_card">{children}</div>;

const ListCardRow = ({ as = 'button', onClick, className = '', children }) => {
  const classes = `volta-list_card-row ${className}`.trim();
  return as === 'div'
    ? <div className={classes}>{children}</div>
    : <button type="button" onClick={onClick} className={`${classes} volta-list_card-row--action`}>{children}</button>;
};

export { ListCard, ListCardRow };
export default ListCard;
