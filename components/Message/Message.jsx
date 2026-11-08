import PropTypes from 'prop-types';
import classnames from 'classnames';

import Icon from '../Icon/Icon';

import './Message.scss';

// `type` picks the icon, colour and ARIA role. A missing or unknown type shows
// the text as a plain message instead of failing.
const Message = ({ type, message, children }) => {
  const details = Object.hasOwn(Message.typeDetails, type) ? Message.typeDetails[type] : null;

  return (
    <div className={classnames('volta-message', details && details.className)} role={details ? details.role : undefined}>
      {details && <Icon type={details.icon} aria-hidden="true" />}
      {message || children}
    </div>
  );
};

Message.typeDetails = {
  success: {
    className: 'volta-message-success',
    icon: 'check-circle',
    role: 'status'
  },
  error: {
    className: 'volta-message-error',
    icon: 'times-circle',
    role: 'alert'
  }
};

Message.propTypes = {
  type: PropTypes.oneOf(Object.keys(Message.typeDetails)),
  // The text to show; children are shown when there is no message
  message: PropTypes.node,
  children: PropTypes.node
};

export default Message;
