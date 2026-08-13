import DateFormat from '../../components/DatePicker/DateFormat';

describe('DateFormat', () => {
  it('returns a formatted date string', () => {
    expect(DateFormat({ date: new Date(2026, 0, 15), format: 'M/D/YY' })).toBe('1/15/26');
  });

  it('returns the configured empty value when no date is provided', () => {
    expect(DateFormat({ empty: 'Not set' })).toBe('Not set');
  });
});
