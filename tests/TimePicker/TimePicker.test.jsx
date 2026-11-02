import { render, screen, fireEvent } from '@testing-library/react';

import TimePicker from '../../components/TimePicker/TimePicker';

const hourInput = () => screen.getByPlaceholderText('hh');
const minuteInput = () => screen.getByPlaceholderText('mm');
const type = (input, value) => fireEvent.change(input, { target: { value } });

describe('TimePicker', () => {
  it('renders without a Router', () => {
    const { container } = render(<TimePicker />);
    expect(container).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Time' })).toBeInTheDocument();
  });

  it('starts empty and reports nothing until an hour is chosen', () => {
    const onChange = jest.fn();
    render(<TimePicker onChange={onChange} />);
    expect(hourInput()).toHaveValue('');
    type(minuteInput(), '30');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('reports a 12-hour time as the user fills it in', () => {
    const onChange = jest.fn();
    render(<TimePicker onChange={onChange} />);
    type(hourInput(), '3');
    type(minuteInput(), '30');
    fireEvent.click(screen.getByRole('button', { name: 'pm' }));

    expect(onChange).toHaveBeenLastCalledWith({
      hour: 3, minute: '30', pm: true, fullDate: '15:30', formatted: '3:30 pm'
    });
  });

  it('zero-pads minutes instead of reporting "0"', () => {
    const onChange = jest.fn();
    render(<TimePicker onChange={onChange} />);
    type(hourInput(), '9');
    type(minuteInput(), '5');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ minute: '05', fullDate: '9:05', formatted: '9:05 am' }));
  });

  it('treats 12 am as midnight and 12 pm as noon', () => {
    const onChange = jest.fn();
    render(<TimePicker onChange={onChange} />);
    type(hourInput(), '12');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ fullDate: '0:00', formatted: '12:00 am' }));
    fireEvent.click(screen.getByRole('button', { name: 'pm' }));
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ fullDate: '12:00', formatted: '12:00 pm' }));
  });

  it('ignores hours and minutes that are out of range', () => {
    const onChange = jest.fn();
    render(<TimePicker onChange={onChange} />);
    type(hourInput(), '13');
    type(hourInput(), '0');
    type(hourInput(), 'ab');
    type(hourInput(), '4');
    type(minuteInput(), '75');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ hour: 4, minute: '00' }));
  });

  it('shows a value passed in, including one that arrives later', () => {
    const { rerender } = render(<TimePicker value="15:45" />);
    expect(hourInput()).toHaveValue('3');
    expect(minuteInput()).toHaveValue('45');
    expect(screen.getByRole('button', { name: 'pm' })).toHaveAttribute('aria-pressed', 'true');

    rerender(<TimePicker value="9:05" />);
    expect(hourInput()).toHaveValue('9');
    expect(minuteInput()).toHaveValue('05');
    expect(screen.getByRole('button', { name: 'am' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('accepts the object and the "3:30 pm" text it reports', () => {
    const { rerender } = render(<TimePicker value={{ fullDate: '21:10' }} />);
    expect(hourInput()).toHaveValue('9');
    expect(screen.getByRole('button', { name: 'pm' })).toHaveAttribute('aria-pressed', 'true');

    rerender(<TimePicker value="12:00 am" />);
    expect(hourInput()).toHaveValue('12');
    expect(screen.getByRole('button', { name: 'am' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('offers hours 0-23 and no am/pm control in 24-hour mode', () => {
    const onChange = jest.fn();
    render(<TimePicker twentyFourHour onChange={onChange} />);
    expect(screen.queryByRole('button', { name: 'pm' })).toBeNull();
    type(hourInput(), '18');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ hour: 18, fullDate: '18:00', formatted: '18:00' }));
  });

  it('puts back the last good value when the field is left half-typed', () => {
    render(<TimePicker value="3:30 pm" />);
    type(hourInput(), '1x');
    expect(hourInput()).toHaveValue('1x');
    fireEvent.blur(hourInput());
    expect(hourInput()).toHaveValue('3');
  });
});
