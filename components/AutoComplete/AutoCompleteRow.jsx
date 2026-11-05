// A single row in <AutoComplete>. The original version also supported
// 'person'/'color' row types backed by Avatar/Track child components that
// don't exist in this repo -- this is the plain label-only row.
//
// Chosen on mousedown (not click) so the text box keeps focus while the list
// is used with the mouse.
import PropTypes from 'prop-types';

const AutoCompleteRow = ({ id, data = {}, isFocused = false, onClick = () => {} }) => (
  <li id={id} role="option" aria-selected={isFocused} className={`lst_row ${isFocused ? 'is-focused' : ''}`} onMouseDown={onClick}>
    {data.title}
  </li>
);

AutoCompleteRow.propTypes = {
  id: PropTypes.string,
  isFocused: PropTypes.bool,
  data: PropTypes.shape({
    title: PropTypes.string,
    value: PropTypes.any
  }),
  onClick: PropTypes.func
};

export default AutoCompleteRow;
