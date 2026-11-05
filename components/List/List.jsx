// Creates a list with items. Each item can take:
// label  - the text of the item
// action - the click handler for the item, called with (index, item, event)
//
// const items = [
//   { label: 'Profile' },
//   { label: 'Logout', action: () => logOut() }
// ];
// <List items={items} />
import PropTypes from 'prop-types';

import './List.scss';

const List = ({ items }) => {
  if (!items) return null;

  return (
    <ul className="volta-list">
      {items.map((item, index) => (
        <li className="lst_row" key={index}>
          {typeof item.action === 'function'
            ? <button type="button" onClick={(e) => item.action(index, item, e)}>{item.label}</button>
            : <span>{item.label}</span>}
        </li>
      ))}
    </ul>
  );
};

List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.node,
    action: PropTypes.func
  }))
};

export default List;
