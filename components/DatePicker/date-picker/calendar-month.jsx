const React = require('react');
const DateTime = require('../utils/date-time');
const DayButton = require('./day-button');
const ClearFix = require('../clearfix');


const CalendarMonth = React.createClass({

  propTypes: {
    displayDate: PropTypes.object.isRequired,
    selectedDate: PropTypes.object.isRequired,
    autoOk: PropTypes.bool,
    maxDate: PropTypes.object,
    minDate: PropTypes.object,
    onDayTouchTap: PropTypes.func,
    shouldDisableDate: PropTypes.func,
  },

  render() {
    let styles = {
      lineHeight: '32px',
      textAlign: 'center',
      padding: '16px 14px 0 14px',
    };

    return (
      <div style={styles}>
        {this._getWeekElements()}
      </div>
    );
  },

  isSelectedDateDisabled() {
    return this._selectedDateDisabled;
  },

  _getWeekElements() {
    let weekArray = DateTime.getWeekArray(this.props.displayDate);

    return weekArray.map((week, i) => {
      return (
        <ClearFix key={i}>
          {this._getDayElements(week, i)}
        </ClearFix>
      );
    }, this);
  },

  _getDayElements(week, i) {
    return week.map((day, j) => {
      let isSameDate = DateTime.isEqualDate(this.props.selectedDate, day);
      let disabled = this._shouldDisableDate(day);
      let selected = !disabled && isSameDate;

      if (isSameDate) {
        if (disabled) {
          this._selectedDateDisabled = true;
        }
        else {
          this._selectedDateDisabled = false;
        }
      }

      return (
        <DayButton
          key={'db' + i + j}
          date={day}
          onTouchTap={this._handleDayTouchTap}
          selected={selected}
          disabled={disabled} />
      );
    }, this);
  },

  _handleDayTouchTap(e, date) {
    if (this.props.onDayTouchTap) this.props.onDayTouchTap(e, date);
  },

  _shouldDisableDate(day) {
    if (day === null) return false;
    let disabled = !DateTime.isBetweenDates(day, this.props.minDate, this.props.maxDate);
    if (!disabled && this.props.shouldDisableDate) disabled = this.props.shouldDisableDate(day);

    return disabled;
  },

});

module.exports = CalendarMonth;
