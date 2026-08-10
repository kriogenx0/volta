// Creates a list with items. Each item can take:
// label  - the text of the item
// action - the click handler for the item
//
// const items = [
//   { label: 'Profile' },
//   { label: 'Logout', action: () => logOut() }
// ];
// <List items={items} />
import PropTypes from 'prop-types';

const List = ({ items }) => {
  if (!items) return null;

  return (
    <ul className="lst">
      {items.map((item, index) => (
        <li className="lst_row" key={index}>
          {typeof item.action === 'function'
            ? <a href="javascript: void(0)" onClick={(e) => item.action(index, item, e)}>{item.label}</a>
            : <span>{item.label}</span>}
        </li>
      ))}
    </ul>
  );
};

List.propTypes = {
  items: PropTypes.array
};

export default List;
