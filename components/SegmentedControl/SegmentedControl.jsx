import TabBar from '../TabBar/TabBar';

import './SegmentedControl.scss';

const WRAPPER_CLASS = {
  md: 'flex w-fit gap-1 rounded-md bg-gray-100 p-1 text-sm dark:bg-gray-800',
  sm: 'inline-flex rounded-md bg-gray-100 p-0.5 dark:bg-gray-800'
};
const BUTTON_CLASS = {
  md: 'rounded px-3 py-1 font-medium',
  sm: 'rounded px-2 py-1 text-xs font-medium transition-colors disabled:cursor-default'
};

const SegmentedControl = ({ value, onChange, options, size = 'md', disabled = false, ariaLabel, ...legacyProps }) => {
  if (!options) {
    return <div className="c-segmented_control no_select"><TabBar {...legacyProps} /></div>;
  }

  return (
    <div role="group" aria-label={ariaLabel} className={WRAPPER_CLASS[size]}>
      {options.map((option) => {
        const active = value === option.value;
        const stateClass = active
          ? `bg-white shadow-sm dark:bg-gray-700${size === 'sm' ? ' text-gray-900 dark:text-white' : ''}`
          : `text-gray-500 dark:text-gray-400${size === 'sm' ? ' hover:text-gray-900 dark:hover:text-white' : ''}`;
        return <button key={option.value} type="button" disabled={disabled} aria-pressed={active} onClick={() => onChange(option.value)} className={`${BUTTON_CLASS[size]} ${stateClass}`}>{option.label}</button>;
      })}
    </div>
  );
};

export { SegmentedControl };
export default SegmentedControl;
