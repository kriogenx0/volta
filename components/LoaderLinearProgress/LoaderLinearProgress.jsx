import PropTypes from 'prop-types';

import './LoaderLinearProgress.scss';

const LoaderLinearProgress = ({ progress }) => {
  const indeterminate = typeof progress !== 'number';
  const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, progress));

  return (
    <div
      className={'volta-loader_linear_progress' + (indeterminate ? ' is-indeterminate' : '')}
      role='progressbar'
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : clamped}
    >
      <div
        className='volta-loader_linear_progress-bar'
        style={indeterminate ? undefined : { width: `${clamped}%` }}
      />
    </div>
  );
};

LoaderLinearProgress.propTypes = {
  progress: PropTypes.number
};

export { LoaderLinearProgress };
export default LoaderLinearProgress;
