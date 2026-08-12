import React from 'react';

const ListCard = ({ children }) => <div className="volta-list_card divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">{children}</div>;

const ListCardRow = ({ as = 'button', onClick, className = '', children }) => {
  const classes = `flex w-full items-center justify-between gap-4 px-4 py-3 text-left ${className}`.trim();
  return as === 'div'
    ? <div className={classes}>{children}</div>
    : <button type="button" onClick={onClick} className={`${classes} hover:bg-gray-50 dark:hover:bg-gray-900`}>{children}</button>;
};

export { ListCard, ListCardRow };
export default ListCard;
