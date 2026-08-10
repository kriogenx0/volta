// Describes a list header component, belonging within a list component (.lst)
import PropTypes from 'prop-types';

const ListHeader = ({ title }) => (
  <li className="lst_header">
    <h5 className="lst_header_title">{title}</h5>
  </li>
);

ListHeader.propTypes = {
  title: PropTypes.string
};

export default ListHeader;
