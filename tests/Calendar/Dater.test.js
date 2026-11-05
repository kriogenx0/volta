import Dater from '../../components/Calendar/Dater';

describe('Dater', () => {
  it('formats as month/day/year', () => {
    expect(new Dater(new Date(2026, 4, 7)).format()).toBe('5/7/2026');
  });

  it('names the month', () => {
    expect(new Dater(new Date(2026, 4, 7)).monthName()).toBe('May');
  });

  it('works on a copy of the Date or Dater it was made from', () => {
    const date = new Date(2026, 4, 7);
    const dater = new Dater(date);
    dater.nextMonth().day(20);
    expect(date.getTime()).toBe(new Date(2026, 4, 7).getTime());

    const original = new Dater(new Date(2026, 4, 7));
    new Dater(original).previousMonth();
    expect(original.format()).toBe('5/7/2026');
  });

  it('accepts a timestamp or a date string', () => {
    expect(new Dater(new Date(2026, 4, 7).getTime()).format()).toBe('5/7/2026');
    expect(new Dater('2026-05-07T12:00:00').format()).toBe('5/7/2026');
  });

  it('uses today for no date or one it cannot read', () => {
    const today = new Dater(new Date()).format();
    expect(new Dater().format()).toBe(today);
    expect(new Dater('nonsense').format()).toBe(today);
  });

  describe('daysInMonth', () => {
    it.each([
      [new Date(2026, 0, 1), 31],
      [new Date(2026, 0, 31), 31],
      [new Date(2026, 0, 30), 31],
      [new Date(2026, 2, 31), 31],
      [new Date(2026, 3, 30), 30],
      [new Date(2026, 1, 28), 28],
      [new Date(2024, 1, 29), 29]
    ])('counts the days in the month of %s', (date, days) => {
      expect(new Dater(date).daysInMonth()).toBe(days);
    });

    it('does not move the Dater', () => {
      const dater = new Dater(new Date(2026, 0, 31));
      dater.daysInMonth();
      expect(dater.format()).toBe('1/31/2026');
    });
  });

  describe('nextMonth and previousMonth', () => {
    it('step one month by default', () => {
      expect(new Dater(new Date(2026, 4, 12)).nextMonth().format()).toBe('6/12/2026');
      expect(new Dater(new Date(2026, 4, 12)).previousMonth().format()).toBe('4/12/2026');
    });

    it('step several months when asked', () => {
      expect(new Dater(new Date(2026, 4, 12)).nextMonth(3).format()).toBe('8/12/2026');
      expect(new Dater(new Date(2026, 4, 12)).previousMonth(5).format()).toBe('12/12/2025');
    });

    it('stay inside a shorter month instead of spilling into the next', () => {
      expect(new Dater(new Date(2026, 0, 31)).nextMonth().format()).toBe('2/28/2026');
      expect(new Dater(new Date(2024, 0, 31)).nextMonth().format()).toBe('2/29/2024');
      expect(new Dater(new Date(2026, 2, 31)).previousMonth().format()).toBe('2/28/2026');
      expect(new Dater(new Date(2026, 4, 31)).nextMonth().format()).toBe('6/30/2026');
    });
  });

  it('knows the weekday the month starts on', () => {
    // 1 Jan 2026 is a Thursday
    expect(new Dater(new Date(2026, 0, 15)).clone().firstDayOfMonth().dayOfWeek()).toBe(4);
  });

  it('sets the day', () => {
    expect(new Dater(new Date(2026, 4, 12)).day(3).format()).toBe('5/3/2026');
  });
});
