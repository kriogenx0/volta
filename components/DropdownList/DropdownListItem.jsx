import PropTypes from 'prop-types';

import "./DropdownListItem.scss";

const DropdownListItem = ({
    isActive = false,
    onSelect,
    label,
    disabled = false,
    role = 'menuitem'
}) => {
    const actionable = Boolean(onSelect) && !disabled;

    const handleClick = () => {
        if (actionable) onSelect(null, label);
    };

    // Items are focusable and work with Enter and Space, not just the mouse
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    let className = 'v-dropdown_list_item';
    if (onSelect) className += " dropdown_list_item-has_action";
    if (isActive) className += " dropdown_list_item-active";
    if (disabled) className += " dropdown_list_item-disabled";

    return (
        <div
            className={className}
            role={role}
            tabIndex={actionable ? 0 : undefined}
            aria-selected={role === 'option' ? isActive : undefined}
            aria-disabled={disabled || undefined}
            onClick={handleClick}
            onKeyDown={actionable ? handleKeyDown : undefined}
        >
            {label}
        </div>
    );
};

DropdownListItem.propTypes = {
    disabled: PropTypes.bool,
    isActive: PropTypes.bool,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    onSelect: PropTypes.func,
    role: PropTypes.oneOf(['menuitem', 'option'])
};

export default DropdownListItem;
