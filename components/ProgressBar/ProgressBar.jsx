import PropTypes from 'prop-types';

import './ProgressBar.scss';

const ProgressBar = ({ percent, variant }) => {
  const percentDefined = typeof percent == 'number' || percent > 0;
  return (
    <div className={'volta-progress_bar' + (variant ? (' progress_bar-' + variant) : '') + (percentDefined ? '' : (' progress_bar-indeterminate'))}>
      <div className='percent' style={{width: percentDefined ? (percent + '%') : ''}} />
    </div>
  );
};

ProgressBar.variants = ['bouncing', 'flowing'];

ProgressBar.defaultProps = {
  variant: ProgressBar.variants[0]
};

ProgressBar.propTypes = {
  variant: PropTypes.oneOf(ProgressBar.variants),
  percent: PropTypes.any // Strings are permitted, but will show as indeterminate.
};

export default ProgressBar;