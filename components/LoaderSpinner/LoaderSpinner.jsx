// Render a spinner image (ie: loading)

import _ from 'lodash';

import './LoaderSpinner.scss';

const LoaderSpinner = ({ size, fullscreen, className }) => {
  const sizeClass = size ? 'spn-' + size : '';

  return (
    <div className={`c-load_spinner l-inline-block ${fullscreen ? 'spn-full-screen' : ''} ${sizeClass} ${className}`}>
      <div className="spn_spinner">
        {_.times(12, (i) => (
          <div className="spn_spinner_arm" key={i} />
        ))}
      </div>
    </div>
  );
};

LoaderSpinner.defaultProps = {
  className: ''
};

export default LoaderSpinner;
