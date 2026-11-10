import { useId } from 'react';
import PropTypes from 'prop-types';

import './SideBarList.scss';

// A vertical list of choices in a side column, in labelled groups: one item is
// the current one. Items are strings, or { value, label, href } when the value that
// comes back differs from the text shown (or is null, as for an "All" item).
// With an href the item is a link, otherwise a button.
const itemOf = (item) => (typeof item === 'object' && item !== null ? item : { value: item, label: item });

const SideBarList = ({ groups = [], value, onSelect, header, emptyMessage, ariaLabel = 'Sidebar', className, ...otherProps }) => {
  const listId = useId();
  // A plain click on a link is handled here; a modified click (new tab) is left to the browser
  const handleClick = (event, item) => {
    if (item.href && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0)) return;
    if (item.href) event.preventDefault();
    if (onSelect) onSelect(item.value);
  };

  return (
    <nav className={['volta-sidebar_list', className].filter(Boolean).join(' ')} aria-label={ariaLabel} {...otherProps}>
      {header && <div className="sidebar_list-header">{header}</div>}
      {emptyMessage && (
        <p className="sidebar_list-empty" role="status">{emptyMessage}</p>
      )}
      {groups.map((group, index) => (
        <div className="sidebar_list-group" key={group.label || index}>
          {group.label && <div className="sidebar_list-group_label" id={`${listId}-${index}`}>{group.label}</div>}
          <ul className="sidebar_list-items" aria-labelledby={group.label ? `${listId}-${index}` : undefined}>
            {group.items.map(itemOf).map((item) => {
              const selected = item.value === value;
              const props = {
                className: `sidebar_list-item${selected ? ' sidebar_list-item--selected' : ''}`,
                'aria-current': selected ? 'page' : undefined
              };
              // A link where the item has an address, so it opens in a new tab and is announced as a link;
              // a button where choosing it only changes what the page shows.
              return (
                <li key={String(item.value ?? item.label)}>
                  {item.href
                    ? <a href={item.href} {...props} onClick={(event) => handleClick(event, item)}>{item.label}</a>
                    : <button type="button" {...props} onClick={(event) => handleClick(event, item)}>{item.label}</button>}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};

const itemShape = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({ value: PropTypes.any, label: PropTypes.node.isRequired, href: PropTypes.string })
]);

SideBarList.propTypes = {
  // [{ label, items }]: a group without a label has no heading
  groups: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, items: PropTypes.arrayOf(itemShape).isRequired })),
  // The value of the current item
  value: PropTypes.any,
  // Called with the value of the item that was chosen
  onSelect: PropTypes.func,
  // Shown above the groups, such as a search field
  header: PropTypes.node,
  // A status line shown after the header, for when the list is empty or filtered to nothing
  emptyMessage: PropTypes.node,
  ariaLabel: PropTypes.string,
  className: PropTypes.string
};

export { SideBarList };
export default SideBarList;
