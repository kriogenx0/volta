// A single row in <AutoComplete>. The original version also supported
// 'person'/'color' row types backed by Avatar/Track child components that
// don't exist in this repo -- this is the plain label-only row.
import PropTypes from 'prop-types';

const AutoCompleteRow = ({ data, isFocused, onClick }) => (
  <li className={`lst_row ${isFocused ? 'is-focused' : ''}`}>
    <a tabIndex="-1" href="#" onClick={(e) => e.preventDefault()} onMouseDown={onClick}>{data.title}</a>
  </li>
);

AutoCompleteRow.propTypes = {
  isFocused: PropTypes.bool,
  data: PropTypes.object,
  onClick: PropTypes.func
};

AutoCompleteRow.defaultProps = {
  isFocused: false,
  data: {},
  onClick: () => {}
};

export default AutoCompleteRow;
