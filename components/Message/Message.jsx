const Message = ({ type, message, children }) => (
  <div className={`c-message ${Message.typeDetails[type].className}`}>
    <i className={`fa fa-${Message.typeDetails[type].icon}`} aria-hidden="true"></i>
    {message || children}
  </div>
);

Message.typeDetails = {
  success: {
    className: 'ui-message-success',
    icon: 'check-circle'
  },
  error: {
    className: 'ui-message-error',
    icon: 'times-circle'
  }
};

export default Message;
