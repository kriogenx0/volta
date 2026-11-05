import PropTypes from 'prop-types';

import './MobilePhone.scss';

// The clock a phone shows: 12-hour with no leading zero on the hour, so
// midnight and noon read 12:xx (not 0:xx).
const clockText = (date) => {
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Frames its children (a screen of your app) in a phone. The speaker, clock and
// home button are decoration, so they are hidden from screen readers.
const MobilePhone = ({ children }) => (
  <div className='volta-mobile_phone'>
    <div className='phone-outside'>
      <div className='phone-speaker' aria-hidden='true' />
      <div className='phone-status_bar' aria-hidden='true'>
        {clockText(new Date())}
      </div>
      <div className='phone-display'>
        {children}
      </div>
      <div className='phone-button' aria-hidden='true' />
    </div>
  </div>
);

MobilePhone.propTypes = {
  // The screen shown inside the phone.
  children: PropTypes.node
};

export default MobilePhone;
