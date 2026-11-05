import PropTypes from 'prop-types';

import Button from '../Button';
import Icon from '../Icon';

import './CloseButton.scss';

// Icon-only, so it carries an accessible name; pass aria-label to say what it closes.
const CloseButton = ({ 'aria-label': ariaLabel = 'Close', ...props }) => (
  <Button variant="link" className="volta-close_button" aria-label={ariaLabel} {...props}>
    <Icon type="multiply" aria-hidden="true"/>
  </Button>
);

CloseButton.propTypes = {
  'aria-label': PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default CloseButton;
