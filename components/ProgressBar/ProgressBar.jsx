import PropTypes from 'prop-types';

import './ProgressBar.scss';

const VARIANTS = ['bouncing', 'flowing'];

// A finite number clamped to 0-100, or null when `percent` isn't one. Numeric
// strings are accepted; anything else counts as unknown progress.
const toPercent = (percent) => {
  const value = typeof percent === 'string' && percent.trim() !== '' ? Number(percent) : percent;
  return typeof value === 'number' && Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : null;
};

// `indeterminate` shows an animation for work of unknown length. When it isn't
// passed the bar is indeterminate whenever `percent` isn't a number, so
// `<ProgressBar />` still works; `indeterminate={false}` forces a determinate
// bar (empty without a `percent`). `fixed` pins the bar to the top of the
// window as a page-level loader.
const ProgressBar = ({ percent, indeterminate, variant = VARIANTS[0], fixed = false }) => {
  const value = toPercent(percent);
  const isIndeterminate = indeterminate ?? value === null;

  return (
    <div
      className={
        'volta-progress_bar' +
        (variant ? ' progress_bar-' + variant : '') +
        (isIndeterminate ? ' progress_bar-indeterminate' : '') +
        (fixed ? ' progress_bar-fixed' : '')
      }
      role='progressbar'
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={isIndeterminate ? undefined : (value ?? 0)}
    >
      <div className='percent' style={isIndeterminate ? undefined : { width: `${value ?? 0}%` }} />
    </div>
  );
};

ProgressBar.variants = VARIANTS;

ProgressBar.propTypes = {
  percent: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  indeterminate: PropTypes.bool,
  variant: PropTypes.oneOf(VARIANTS),
  fixed: PropTypes.bool
};

// LoaderLinearProgress is retained as a compatibility name: a ProgressBar
// pinned to the top of the window. `progress` is the old name for `percent`.
const LoaderLinearProgress = ({ progress, ...props }) => (
  <ProgressBar percent={progress} variant='flowing' fixed {...props} />
);

LoaderLinearProgress.propTypes = {
  progress: PropTypes.number
};

export { ProgressBar, LoaderLinearProgress };
export default ProgressBar;
