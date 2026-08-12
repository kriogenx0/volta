const Message = ({ type, message, children }) => (
  <div className={`volta-message ${Message.typeDetails[type].className}`}>
    <i className={`fa fa-${Message.typeDetails[type].icon}`} aria-hidden="true"></i>
    {message || children}
  </div>
);

Message.typeDetails = {
  success: {
    className: 'volta-message-success',
    icon: 'check-circle'
  },
  error: {
    className: 'volta-message-error',
    icon: 'times-circle'
  }
};

export default Message;
