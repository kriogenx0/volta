import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import TabBar from '../TabBar/TabBar';

import './SegmentedControl.scss';

// A row of buttons where one is selected. Two ways to describe the choices:
//   options + value + onChange(value)             -- the modern form
//   tabs + selectedTabIndex + onChange(index, label) -- index-based, as
//     SegmentedControlMini always had it (only with `mini`)
// `mini` is a compact version of either. The selected option is marked by a
// highlight that slides to the new option (and stays put when motion is reduced).
// `navigation` makes it a <nav> whose selected option is aria-current="page"
// instead of a pressed button, for switching between pages. Without `options` or `mini`, this
// renders the legacy TabBar form.
const SegmentedControl = ({
  value, onChange, options, size = 'md', mini = false, disabled = false, ariaLabel, className, navigation = false,
  tabs, selectedTabIndex, ...legacyProps
}) => {
  const root = useRef(null);
  // Where the sliding highlight sits; null until measured, and it only animates after that
  const [thumb, setThumb] = useState(null);
  const [animate, setAnimate] = useState(false);

  const measure = () => {
    const active = root.current?.querySelector('.volta-segmented_control-option--active');
    const next = active ? { left: active.offsetLeft, top: active.offsetTop, width: active.offsetWidth, height: active.offsetHeight } : null;
    // Keep the old object when nothing moved, or setting it would render again forever
    setThumb((prev) => (prev && next && ['left', 'top', 'width', 'height'].every((key) => prev[key] === next[key]) ? prev : next));
  };

  // Every render, because the selection, the labels or the size may have moved it; setThumb
  // bails out when nothing changed.
  useLayoutEffect(() => { if (root.current) measure(); });

  useEffect(() => {
    if (!root.current || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => { if (thumb) setAnimate(true); }, [Boolean(thumb)]);

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

  const Wrapper = navigation ? 'nav' : 'div';
  const wrapperProps = navigation ? {} : { role: 'group' };

  return (
    <Wrapper
      {...wrapperProps}
      ref={root}
      aria-label={label}
      className={`volta-segmented_control volta-segmented_control--${mini ? 'mini' : size}${className ? ` ${className}` : ''}`}
    >
      {/* Runtime position and size of the selected option, so it has to be inline */}
      {thumb && (
        <span
          aria-hidden="true"
          className={`volta-segmented_control-thumb${animate ? ' volta-segmented_control-thumb--animate' : ''}`}
          style={{ width: thumb.width, height: thumb.height, transform: `translate(${thumb.left}px, ${thumb.top}px)` }}
        />
      )}
      {items.map((item) => {
        const active = selected === item.value;
        return (
          <button
            key={item.value}
            type="button"
            disabled={disabled}
            aria-pressed={navigation ? undefined : active}
            aria-current={navigation && active ? 'page' : undefined}
            onClick={() => select(item)}
            className={`volta-segmented_control-option${active ? ' volta-segmented_control-option--active' : ''}`}
          >
            {item.label}
          </button>
        );
      })}
    </Wrapper>
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
  className: PropTypes.string,
  // A <nav> for switching pages: the selected option is aria-current="page", not pressed
  navigation: PropTypes.bool,
  // Index-based choices (mini): labels and the selected index (default 0)
  tabs: PropTypes.arrayOf(PropTypes.string),
  selectedTabIndex: PropTypes.number
};

export { SegmentedControl, SegmentedControlMini };
export default SegmentedControl;
