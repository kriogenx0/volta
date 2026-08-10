import PropTypes from 'prop-types';

const FilterSectionListItem = ({ name, value, selected, onChange }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (onChange) onChange(value);
  };

  return (
    <li className={`lst_row ${selected ? 'is-selected' : ''}`}>
      <a href="#" onClick={handleClick}>{name}</a>
    </li>
  );
};

FilterSectionListItem.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  selected: PropTypes.bool,
  onChange: PropTypes.func
};

export default FilterSectionListItem;
