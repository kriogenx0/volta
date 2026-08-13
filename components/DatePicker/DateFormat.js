import moment from 'moment';

const DateFormat = ({
  date = null,
  format = 'MMMM D, YYYY',
  fromNow = false,
  empty = '',
} = {}) => {
  if (!date) return empty;
  return fromNow ? moment(date).fromNow() : moment(date).format(format);
};

export default DateFormat;
