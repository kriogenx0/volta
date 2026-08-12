import PropTypes from 'prop-types';

import Icon from '../Icon';

import './IndicatorDot.scss';

const IndicatorDot = ({ className, variant, size, ...otherProps }) => {
  const props = {
    className: 'volta-indicator_dot' + (className ? ' ' + className : '') + (variant ? ' indicator_dot-' + variant : '') + (size ? ' indicator_dot-' + size : ''),
    ...otherProps
  };

  return (
    <div {...props}>
      <Icon type='circle.fill' />
    </div>
  );
};

IndicatorDot.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string, // complete
  size: PropTypes.string, // small
};

export default IndicatorDot;
