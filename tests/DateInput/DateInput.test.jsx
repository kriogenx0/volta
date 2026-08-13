import { fireEvent, render, screen } from '@testing-library/react';

import DateInput from '../../components/DateInput/DateInput';
import DatePicker from '../../components/DatePicker/DatePicker';

describe('DateInput', () => {
  it('is a compatibility alias of DatePicker', () => {
    expect(DateInput).toBe(DatePicker);
  });

  it('renders formatted Date values and emits a local Date from CalendarMini', () => {
    const onChange = jest.fn();
    render(<DateInput value={new Date(2026, 0, 15)} onChange={onChange} />);

    const input = screen.getByDisplayValue('Jan 15, 2026');
    fireEvent.click(input);
    fireEvent.click(screen.getByText('20'));

    expect(onChange).toHaveBeenCalledWith(new Date(2026, 0, 20));
  });

  it('disables dates outside range constraints', () => {
    const { container } = render(
      <DateInput
        value={new Date(2026, 0, 15)}
        minDate={new Date(2026, 0, 10)}
        maxDate={new Date(2026, 0, 20)}
      />,
    );

    const days = container.querySelectorAll('.calendar-day');
    expect([...days].find((day) => day.textContent === '9')).toHaveClass('day-inactive');
    expect([...days].find((day) => day.textContent === '10')).toHaveClass('day-active');
    expect([...days].find((day) => day.textContent === '21')).toHaveClass('day-inactive');
  });

  it('renders the requested display format in readonly mode', () => {
    render(<DateInput value={new Date(2026, 0, 15)} format="MMMM d, yyyy" readonly />);
    expect(screen.getByText('January 15, 2026')).toBeInTheDocument();
  });
});
