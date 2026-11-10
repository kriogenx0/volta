import PropTypes from 'prop-types';

import './SideBarList.scss';

// A vertical list of choices in a side column, in labelled groups: one item is
// the current one. Items are strings, or { value, label } when the value that
// comes back differs from the text shown (or is null, as for an "All" item).
const itemOf = (item) => (typeof item === 'object' && item !== null ? item : { value: item, label: item });

const SideBarList = ({ groups = [], value, onSelect, header, emptyMessage, ariaLabel = 'Sidebar', className, ...otherProps }) => (
  <nav className={['volta-sidebar_list', className].filter(Boolean).join(' ')} aria-label={ariaLabel} {...otherProps}>
    {header && <div className="volta-sidebar_list-header">{header}</div>}
    {emptyMessage && (
      <p className="volta-sidebar_list-empty" role="status">{emptyMessage}</p>
    )}
    {groups.map((group, index) => (
      <div className="volta-sidebar_list-group" key={group.label || index}>
        {group.label && <div className="volta-sidebar_list-group_label">{group.label}</div>}
        {group.items.map(itemOf).map((item) => {
          const selected = item.value === value;
          return (
            <button
              type="button"
              key={String(item.value ?? item.label)}
              className={`volta-sidebar_list-item${selected ? ' volta-sidebar_list-item--selected' : ''}`}
              aria-current={selected ? 'page' : undefined}
              onClick={() => onSelect && onSelect(item.value)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    ))}
  </nav>
);

const itemShape = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({ value: PropTypes.any, label: PropTypes.node.isRequired })
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
