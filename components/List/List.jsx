// A vertical list of rows, and with `card` the same list in a bordered card with
// dividers. Rows come from `items` (data), or from ListRow children (markup).
//
// Each item can take:
// label  - the text of the item
// action - the click handler for the item, called with (index, item, event)
//
// const items = [
//   { label: 'Profile' },
//   { label: 'Logout', action: () => logOut() }
// ];
// <List items={items} />
// <List card><ListRow onClick={update}><span>Payment method</span><span>Visa</span></ListRow></List>
import PropTypes from 'prop-types';

import './List.scss';

// A row you write yourself, for content more than a label: a button (the default,
// which reacts to the cursor) or, with as="div", a static line.
const ListRow = ({ as = 'button', onClick, className = '', children }) => (
  <li className={`lst_row${className ? ` ${className}` : ''}`}>
    {as === 'div'
      ? <div>{children}</div>
      : <button type="button" onClick={onClick}>{children}</button>}
  </li>
);

ListRow.propTypes = {
  // 'button' (default) is clickable; 'div' is a static row
  as: PropTypes.oneOf(['button', 'div']),
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
};

const List = ({ items, children, card = false, className = '' }) => {
  if (!items && !children) return null;

  return (
    <ul className={`volta-list${card ? ' volta-list--card' : ''}${className ? ` ${className}` : ''}`}>
      {items
        ? items.map((item, index) => (
          <li className="lst_row" key={index}>
            {typeof item.action === 'function'
              ? <button type="button" onClick={(e) => item.action(index, item, e)}>{item.label}</button>
              : <span>{item.label}</span>}
          </li>
        ))
        : children}
    </ul>
  );
};

List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.node,
    action: PropTypes.func
  })),
  // ListRows (or ListHeader, FilterSectionListItem), used when there are no items
  children: PropTypes.node,
  // A bordered, rounded card with a divider between rows and more room in each
  card: PropTypes.bool,
  className: PropTypes.string
};

// ListCard and ListCardRow are other names for the card form of List and for ListRow,
// kept for existing callers.
const ListCard = (props) => <List card {...props} />;
const ListCardRow = (props) => <ListRow {...props} />;

export { List, ListRow, ListCard, ListCardRow };
export default List;
