import './MobilePhone.scss';

const MobilePhone = ({ children }) => {
  const date = new Date();

  return (
    <div className='c-mobile_phone'>
      <div className='phone-outside'>
        <div className='phone-speaker' />
        <div className='phone-status_bar'>
          { (date.getHours() % 12) + ":" + date.toTimeString().substr(3, 2) }
        </div>
        <div className='phone-display'>
          {children}
        </div>
        <div className='phone-button' />
      </div>
    </div>
  );
};

export default MobilePhone;
