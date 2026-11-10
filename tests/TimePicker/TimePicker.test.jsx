import { act, render, screen, fireEvent } from '@testing-library/react';

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

describe('TimePicker dropdown', () => {
  const hours = () => screen.getByRole('group', { name: 'Hours' });
  const minutes = () => screen.getByRole('group', { name: 'Minutes' });
  const inside = (group) => [...group.querySelectorAll('button')].map((button) => button.textContent);

  it('is closed until a field has focus', () => {
    render(<TimePicker />);
    expect(screen.queryByRole('group', { name: 'Hours' })).toBeNull();
    expect(screen.queryByRole('group', { name: 'Minutes' })).toBeNull();
  });

  it.each([['hour', hourInput], ['minute', minuteInput]])('opens one dropdown with both lists when the %s field gets focus', (_name, field) => {
    render(<TimePicker />);
    fireEvent.focus(field());
    expect(inside(hours())).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
    expect(inside(minutes())).toEqual(['00', '15', '30', '45']);
  });

  it('lists 0 to 23 in 24-hour mode and the minutes at the interval asked for', () => {
    render(<TimePicker twentyFourHour minuteInterval={20} />);
    fireEvent.focus(hourInput());
    expect(inside(hours())).toHaveLength(24);
    expect(inside(hours())[0]).toBe('0');
    expect(inside(minutes())).toEqual(['00', '20', '40']);
  });

  it('marks the chosen hour and minute', () => {
    render(<TimePicker value="3:30 pm" />);
    fireEvent.focus(minuteInput());
    expect(screen.getByRole('button', { name: '3' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '30' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '4' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('sets the field and reports the time when an hour or a minute is picked', () => {
    const onChange = jest.fn();
    render(<TimePicker onChange={onChange} />);
    fireEvent.focus(hourInput());
    fireEvent.click(screen.getByRole('button', { name: '9' }));
    expect(hourInput()).toHaveValue('9');
    fireEvent.click(screen.getByRole('button', { name: '45' }));
    expect(minuteInput()).toHaveValue('45');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ hour: 9, minute: '45', formatted: '9:45 am' }));
  });

  it('stays open after a pick, so hour and minute can be chosen one after the other', () => {
    render(<TimePicker />);
    fireEvent.focus(hourInput());
    fireEvent.click(screen.getByRole('button', { name: '9' }));
    expect(screen.getByRole('group', { name: 'Minutes' })).toBeInTheDocument();
  });

  it('keeps the field focused when the lists are pressed', () => {
    render(<TimePicker />);
    fireEvent.focus(hourInput());
    const notPrevented = fireEvent.mouseDown(screen.getByRole('button', { name: '9' }));
    expect(notPrevented).toBe(false);
  });

  it('closes on Escape', () => {
    render(<TimePicker />);
    fireEvent.focus(hourInput());
    fireEvent.keyDown(hourInput(), { key: 'Escape' });
    expect(screen.queryByRole('group', { name: 'Hours' })).toBeNull();
  });

  describe('closing when focus leaves', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('closes shortly after focus leaves the picker', () => {
      render(<TimePicker />);
      fireEvent.focus(hourInput());
      fireEvent.blur(hourInput());
      expect(screen.getByRole('group', { name: 'Hours' })).toBeInTheDocument();
      act(() => { jest.advanceTimersByTime(250); });
      expect(screen.queryByRole('group', { name: 'Hours' })).toBeNull();
    });

    it('stays open when focus moves from one field to the other', () => {
      render(<TimePicker />);
      fireEvent.focus(hourInput());
      fireEvent.blur(hourInput());
      fireEvent.focus(minuteInput());
      act(() => { jest.advanceTimersByTime(250); });
      expect(screen.getByRole('group', { name: 'Minutes' })).toBeInTheDocument();
    });

    it('does not fire a state update after unmounting', () => {
      const error = jest.spyOn(console, 'error').mockImplementation(() => {});
      const { unmount } = render(<TimePicker />);
      fireEvent.focus(hourInput());
      fireEvent.blur(hourInput());
      unmount();
      act(() => { jest.advanceTimersByTime(250); });
      expect(error).not.toHaveBeenCalled();
      error.mockRestore();
    });
  });

  describe('arrow keys', () => {
    it('step the hour, wrapping round the clock', () => {
      render(<TimePicker value="12:00 pm" />);
      fireEvent.keyDown(hourInput(), { key: 'ArrowUp' });
      expect(hourInput()).toHaveValue('1');
      fireEvent.keyDown(hourInput(), { key: 'ArrowDown' });
      expect(hourInput()).toHaveValue('12');
      fireEvent.keyDown(hourInput(), { key: 'ArrowDown' });
      expect(hourInput()).toHaveValue('11');
    });

    it('step the minute by the interval, wrapping past the hour', () => {
      const onChange = jest.fn();
      render(<TimePicker value="3:45 pm" onChange={onChange} />);
      fireEvent.keyDown(minuteInput(), { key: 'ArrowUp' });
      expect(minuteInput()).toHaveValue('00');
      fireEvent.keyDown(minuteInput(), { key: 'ArrowDown' });
      expect(minuteInput()).toHaveValue('45');
      expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ minute: '45' }));
    });

    it('start an empty hour field at the ends of the list', () => {
      render(<TimePicker />);
      fireEvent.keyDown(hourInput(), { key: 'ArrowUp' });
      expect(hourInput()).toHaveValue('1');
    });

    it('are left alone in the fields for other keys', () => {
      render(<TimePicker value="3:00 pm" />);
      const notPrevented = fireEvent.keyDown(hourInput(), { key: 'a' });
      expect(notPrevented).toBe(true);
    });
  });
});
