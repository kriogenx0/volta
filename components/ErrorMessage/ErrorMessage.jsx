import PropTypes from 'prop-types';

import Message from '../Message/Message';

// An error as a card in the error colour: Message with type="error" (a tinted red
// background, a red edge and a red icon, announced to screen readers). Under a field
// it is described to the control instead of announced, so a field passes role={null}.
// ErrorText is another name for it, kept for existing callers.
const ErrorMessage = ({ message, children, role }) => (
  <Message type="error" message={message} role={role}>{children}</Message>
);

ErrorMessage.propTypes = {
  // Text, or markup such as <strong> for emphasis
  message: PropTypes.node,
  // The content, used when there is no message
  children: PropTypes.node,
  // Replaces the alert role; null leaves the message out of the live regions
  role: PropTypes.string
};

const ErrorText = ErrorMessage;

export { ErrorMessage, ErrorText };
export default ErrorMessage;
