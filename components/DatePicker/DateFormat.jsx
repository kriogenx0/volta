// Formats a date/time value with moment.
//
// <DateFormat date={yourDate} format="M/D/YY" />
import moment from 'moment';
import PropTypes from 'prop-types';

const DateFormat = ({ date, format, fromNow, empty }) => (
  <span>
    {date
      ? (fromNow ? moment(date).fromNow() : moment(date).format(format))
      : empty}
  </span>
);

DateFormat.propTypes = {
  date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  format: PropTypes.string,
  fromNow: PropTypes.bool,
  empty: PropTypes.string
};

DateFormat.defaultProps = {
  date: null,
  format: 'MMMM D, YYYY',
  fromNow: false,
  empty: ''
};

export default DateFormat;
