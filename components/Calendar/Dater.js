class Dater {
  constructor(date) {
    this.load(date);
  }

  factory(date) {
    return new Dater(date);
  }

  clone() {
    return this.factory(this.date.getTime());
  }

  cloneDate() {
    return new Date(this.date.getTime());
  }

  // FORMATS
  format() {
    return this.mdy();
  }

  mdy() {
    return this.month() + '/' + this.day() + '/' + this.year();
  }

  // GETTER SETTER
  day(dayNumber) {
    if (typeof dayNumber !== 'undefined') {
      this.date.setDate(dayNumber);
      return this;
    } else {
      return this.date.getDate();
    }
  }

  // GETTING
  dayOfWeek() {
    return this.date.getDay();
  }

  month() {
    return this.date.getMonth() + 1;
  }

  monthName() {
    return Dater.monthList[this.month() - 1];
  }

  year() {
    return this.date.getFullYear();
  }

  daysInMonth() {
    return this.clone().lastDayOfMonth().date.getDate();
  }

  // MUTATING
  // Always works on its own copy of the date, so moving a Dater around never
  // changes the Date (or Dater) it was made from. An unreadable date means today.
  load(date) {
    const source = date instanceof Dater ? date.date : date;
    const next = source ? new Date(source instanceof Date ? source.getTime() : source) : new Date();
    this.date = isNaN(next.getTime()) ? new Date() : next;
  }

  now() {
    this.load();
    return this;
  }

  firstDayOfMonth() {
    this.date.setDate(1);
    return this;
  }

  // Stays in the target month when it is shorter: Jan 31 plus a month is Feb 28
  // (or 29), not Mar 3.
  nextMonth(increment) {
    const day = this.date.getDate();
    this.date.setDate(1);
    this.date.setMonth(this.date.getMonth() + (increment || 1));
    const daysInTarget = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    this.date.setDate(Math.min(day, daysInTarget));
    return this;
  }

  previousMonth(increment) {
    return this.nextMonth((increment || 1) * -1);
  }

  lastDayOfMonth() {
    this.nextMonth().date.setDate(0);
    return this;
  }

}

Dater.dayAbbreviation = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
Dater.dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
Dater.monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default Dater;
