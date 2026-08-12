import { fireEvent, render, screen } from '@testing-library/react';

import DateInput from '../../components/DateInput/DateInput';

describe('DateInput', () => {
  it('renders Date values for the native control and emits a local Date', () => {
    const onChange = jest.fn();
    render(<DateInput value={new Date(2026, 0, 15)} onChange={onChange} />);

    const input = screen.getByDisplayValue('2026-01-15');
    fireEvent.change(input, { target: { value: '2026-06-20' } });

    expect(onChange).toHaveBeenCalledWith(new Date(2026, 5, 20));
  });

  it('passes range constraints to the native control', () => {
    render(
      <DateInput
        value={new Date(2026, 0, 15)}
        minDate={new Date(2026, 0, 1)}
        maxDate={new Date(2026, 11, 31)}
      />,
    );

    const input = screen.getByDisplayValue('2026-01-15');
    expect(input).toHaveAttribute('min', '2026-01-01');
    expect(input).toHaveAttribute('max', '2026-12-31');
  });

  it('renders the requested display format in readonly mode', () => {
    render(<DateInput value={new Date(2026, 0, 15)} format="MMMM d, yyyy" readonly />);
    expect(screen.getByText('January 15, 2026')).toBeInTheDocument();
  });
});
