import { render, screen, fireEvent, within } from '@testing-library/react';

import DatePicker from '../../components/DatePicker/DatePicker';

const field = () => screen.getByRole('textbox');
const day = (name) => screen.getByRole('button', { name });

describe('DatePicker', () => {
  it('renders without crashing', () => {
    const { container } = render(<DatePicker />);
    expect(container).toBeInTheDocument();
  });

  it('shows an empty field when it has no date', () => {
    render(<DatePicker />);
    expect(field()).toHaveValue('');
  });

  it('shows the defaultValue in the default format', () => {
    render(<DatePicker defaultValue={new Date(2026, 5, 15)} />);
    expect(field()).toHaveValue('Jun 15, 2026');
  });

  it('writes the date in the given format', () => {
    render(<DatePicker defaultValue={new Date(2026, 5, 15)} format="yyyy-MM-dd" />);
    expect(field()).toHaveValue('2026-06-15');
  });

  it('is labelled by its label prop', () => {
    render(<DatePicker label="Start date" />);
    expect(screen.getByLabelText('Start date')).toBe(field());
  });

  it('is a read-only text field that announces a popup', () => {
    render(<DatePicker />);
    expect(field()).toHaveAttribute('readonly');
    expect(field()).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('opens the calendar on focus and says so', () => {
    const { container } = render(<DatePicker defaultValue={new Date(2026, 5, 15)} />);
    expect(container.querySelector('.volta-dropdown')).not.toHaveClass('is-open');
    expect(field()).toHaveAttribute('aria-expanded', 'false');

    fireEvent.focus(field());
    expect(container.querySelector('.volta-dropdown')).toHaveClass('is-open');
    expect(field()).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens the calendar on click', () => {
    const { container } = render(<DatePicker />);
    fireEvent.click(field());
    expect(container.querySelector('.volta-dropdown')).toHaveClass('is-open');
  });

  describe('choosing a date', () => {
    it('calls onChange with a Date for the chosen day, shows it and closes', () => {
      const onChange = jest.fn();
      const { container } = render(<DatePicker defaultValue={new Date(2026, 5, 15)} onChange={onChange} />);
      fireEvent.focus(field());
      fireEvent.click(day('June 20, 2026'));

      const chosen = onChange.mock.calls[0][0];
      expect(chosen).toBeInstanceOf(Date);
      expect([chosen.getFullYear(), chosen.getMonth(), chosen.getDate()]).toEqual([2026, 5, 20]);
      expect(field()).toHaveValue('Jun 20, 2026');
      expect(container.querySelector('.volta-dropdown')).not.toHaveClass('is-open');
    });

    it('works without an onChange', () => {
      render(<DatePicker defaultValue={new Date(2026, 5, 15)} />);
      fireEvent.focus(field());
      expect(() => fireEvent.click(day('June 3, 2026'))).not.toThrow();
      expect(field()).toHaveValue('Jun 3, 2026');
    });

    it('picks a date from an empty field, starting on the current month', () => {
      const onChange = jest.fn();
      render(<DatePicker onChange={onChange} />);
      fireEvent.focus(field());
      fireEvent.click(screen.getAllByRole('button', { name: /^\w+ 1, \d{4}$/ })[0]);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0].getDate()).toBe(1);
    });

    it('stays open while paging through months, and keeps the chosen date unchanged', () => {
      const value = new Date(2026, 0, 31);
      const { container } = render(<DatePicker defaultValue={value} />);
      fireEvent.focus(field());
      fireEvent.click(screen.getByRole('button', { name: 'Next month' }));

      expect(container.querySelector('.volta-dropdown')).toHaveClass('is-open');
      expect(screen.getByRole('button', { name: 'February 1, 2026' })).toBeInTheDocument();
      expect(field()).toHaveValue('Jan 31, 2026');
      expect(value.getMonth()).toBe(0);
    });
  });

  describe('controlled', () => {
    it('shows the value prop and follows it', () => {
      const { rerender } = render(<DatePicker value={new Date(2026, 5, 15)} />);
      expect(field()).toHaveValue('Jun 15, 2026');
      rerender(<DatePicker value={new Date(2026, 6, 4)} />);
      expect(field()).toHaveValue('Jul 4, 2026');
    });

    it('reports a chosen date but waits for the parent to change the value', () => {
      const onChange = jest.fn();
      render(<DatePicker value={new Date(2026, 5, 15)} onChange={onChange} />);
      fireEvent.focus(field());
      fireEvent.click(day('June 20, 2026'));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(field()).toHaveValue('Jun 15, 2026');
    });

    it('can be cleared by passing null', () => {
      const { rerender } = render(<DatePicker value={new Date(2026, 5, 15)} />);
      rerender(<DatePicker value={null} />);
      expect(field()).toHaveValue('');
    });
  });

  describe('limits', () => {
    const limited = (props) => render(
      <DatePicker defaultValue={new Date(2026, 5, 15)} minDate={new Date(2026, 5, 10)} maxDate={new Date(2026, 5, 20)} {...props} />
    );

    it('disables days outside minDate and maxDate, ends included', () => {
      limited();
      expect(day('June 9, 2026')).toBeDisabled();
      expect(day('June 10, 2026')).toBeEnabled();
      expect(day('June 20, 2026')).toBeEnabled();
      expect(day('June 21, 2026')).toBeDisabled();
    });

    it('does not choose a disabled day', () => {
      const onChange = jest.fn();
      limited({ onChange });
      fireEvent.focus(field());
      fireEvent.click(day('June 21, 2026'));
      expect(onChange).not.toHaveBeenCalled();
      expect(field()).toHaveValue('Jun 15, 2026');
    });
  });

  describe('disabled and read-only', () => {
    it('does not open when disabled', () => {
      const { container } = render(<DatePicker disabled defaultValue={new Date(2026, 5, 15)} />);
      expect(field()).toBeDisabled();
      fireEvent.click(field());
      fireEvent.focus(field());
      expect(container.querySelector('.volta-dropdown')).not.toHaveClass('is-open');
    });

    it('shows only the formatted date when readonly', () => {
      render(<DatePicker readonly defaultValue={new Date(2026, 5, 15)} />);
      expect(screen.queryByRole('textbox')).toBeNull();
      expect(screen.getByText('Jun 15, 2026')).toBeInTheDocument();
    });

    it('shows nothing for a readonly picker without a date', () => {
      const { container } = render(<DatePicker readonly />);
      expect(within(container).queryByRole('textbox')).toBeNull();
      expect(container).toHaveTextContent('');
    });
  });
});
