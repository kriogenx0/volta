import PropTypes from 'prop-types';

import "./DropdownListItem.scss";

const DropdownListItem = ({
    isActive,
    onSelect,
    label,
    disabled
}) => {
    const handleClick = (e) => {
        onSelect && onSelect(null, label);
    };

    let className = 'v-dropdown_list_item';
    if (onSelect) className += " dropdown_list_item-has_action";
    if (isActive) className += " dropdown_list_item-active";
    if (disabled) className += " dropdown_list_item-disabled";

    return (
        <div className={className} onClick={handleClick}>
            {label}
        </div>
    );
};

DropdownListItem.propTypes = {
    isActive: PropTypes.bool,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    onSelect: PropTypes.func
};

DropdownListItem.defaultProps = {
};

export default DropdownListItem;