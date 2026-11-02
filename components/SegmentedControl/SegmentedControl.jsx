import PropTypes from 'prop-types';

import TabBar from '../TabBar/TabBar';

import './SegmentedControl.scss';

// A row of buttons where one is selected. Two ways to describe the choices:
//   options + value + onChange(value)             -- the modern form
//   tabs + selectedTabIndex + onChange(index, label) -- index-based, as
//     SegmentedControlMini always had it (only with `mini`)
// `mini` is a compact version of either. Without `options` or `mini`, this
// renders the legacy TabBar form.
const SegmentedControl = ({
  value, onChange, options, size = 'md', mini = false, disabled = false, ariaLabel,
  tabs, selectedTabIndex, ...legacyProps
}) => {
  if (!options && !mini) {
    return (
      <div className="volta-segmented_control no_select">
        <TabBar tabs={tabs} selectedTabIndex={selectedTabIndex} onChange={onChange} {...legacyProps} />
      </div>
    );
  }

  const indexed = !options;
  const items = options || (tabs || []).map((label, index) => ({ label, value: index }));
  const selected = indexed ? (selectedTabIndex ?? 0) : value;
  const select = (item) => (indexed ? onChange?.(item.value, item.label) : onChange?.(item.value));
  const label = ariaLabel ?? (indexed ? 'View options' : undefined);

  return (
    <div role="group" aria-label={label} className={`volta-segmented_control volta-segmented_control--${mini ? 'mini' : size}`}>
      {items.map((item) => {
        const active = selected === item.value;
        return (
          <button
            key={item.value}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            onClick={() => select(item)}
            className={`volta-segmented_control-option${active ? ' volta-segmented_control-option--active' : ''}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

// SegmentedControlMini is retained as a compatibility name for SegmentedControl mini.
const SegmentedControlMini = (props) => <SegmentedControl mini {...props} />;

SegmentedControl.propTypes = {
  value: PropTypes.any,
  options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.node, value: PropTypes.any })),
  // (value) with options; (index, label) with tabs
  onChange: PropTypes.func,
  size: PropTypes.oneOf(['md', 'sm']),
  // Compact look; works with options or tabs
  mini: PropTypes.bool,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
  // Index-based choices (mini): labels and the selected index (default 0)
  tabs: PropTypes.arrayOf(PropTypes.string),
  selectedTabIndex: PropTypes.number
};

export { SegmentedControl, SegmentedControlMini };
export default SegmentedControl;
