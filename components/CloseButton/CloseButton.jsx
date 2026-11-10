import PropTypes from 'prop-types';

import Button from '../Button';
import Icon from '../Icon';

import './CloseButton.scss';

// Icon-only, so it carries an accessible name; pass aria-label to say what it closes.
// `size="sm"` is for dialog headers, where it sits next to a title; the default
// is the large close button used on its own.
const CloseButton = ({ 'aria-label': ariaLabel = 'Close', size = 'md', className, ...props }) => (
  <Button
    variant="link"
    className={['volta-close_button', size === 'sm' && 'close_button-sm', className].filter(Boolean).join(' ')}
    aria-label={ariaLabel}
    {...props}
  >
    <Icon type="xmark" aria-hidden="true" />
  </Button>
);

CloseButton.sizes = ['md', 'sm'];

CloseButton.propTypes = {
  'aria-label': PropTypes.string,
  size: PropTypes.oneOf(CloseButton.sizes),
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default CloseButton;
