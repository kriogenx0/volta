import PropTypes from 'prop-types';

import './SegmentedControlMini.scss';

const SegmentedControlMini = ({
  tabs = [],
  selectedTabIndex = 0,
  onChange,
  ariaLabel = 'View options'
}) => {
  return (
    <div className='volta-segmented_control_mini' role='group' aria-label={ariaLabel}>
      {tabs.map((label, index) => {
        const active = selectedTabIndex === index;
        return (
          <button
            key={label}
            type='button'
            className={active ? 'is-active' : ''}
            aria-pressed={active}
            onClick={() => onChange?.(index, label)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

SegmentedControlMini.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string),
  selectedTabIndex: PropTypes.number,
  onChange: PropTypes.func,
  ariaLabel: PropTypes.string
};

export { SegmentedControlMini };
export default SegmentedControlMini;
