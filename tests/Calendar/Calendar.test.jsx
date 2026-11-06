import { render, screen, fireEvent, within } from '@testing-library/react';

import Calendar from '../../components/Calendar/Calendar';
import Dater from '../../util/Dater';

const dayButtons = () => screen.getAllByRole('button', { name: /^[A-Z][a-z]+ \d+, \d{4}$/ });

describe('Calendar', () => {
  it('renders without crashing', () => {
    const { container } = render(<Calendar />);
    expect(container).toBeInTheDocument();
  });

  it('opens on the current month when given no date', () => {
    const today = new Date();
    render(<Calendar />);
    const label = `${new Dater(today).monthName()} ${today.getDate()}, ${today.getFullYear()}`;
    expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-current', 'date');
  });

  it('shows the month, short year and every day of the date it is given', () => {
    render(<Calendar date={new Date(2024, 1, 29)} />);
    expect(screen.getByRole('button', { name: 'Feb 24' })).toBeInTheDocument();
    expect(dayButtons()).toHaveLength(29);
    expect(screen.getByRole('button', { name: 'February 29, 2024' })).toHaveAttribute('aria-current', 'date');
  });

  it('leaves a leap-year February at 28 days otherwise', () => {
    render(<Calendar date={new Date(2026, 1, 10)} />);
    expect(dayButtons()).toHaveLength(28);
  });

  it('counts the days of a 31-day month when the date is its 31st', () => {
    render(<Calendar date={new Date(2026, 2, 31)} />);
    expect(dayButtons()).toHaveLength(31);
  });

  it('highlights only the current day', () => {
    const { container } = render(<Calendar date={new Date(2026, 4, 12)} />);
    const current = container.querySelectorAll('.day-current');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent('12');
  });

  it('pads the first week so day 1 falls on its weekday', () => {
    // 1 Jan 2026 is a Thursday, so four blank cells (Sun to Wed) come first
    const { container } = render(<Calendar date={new Date(2026, 0, 15)} />);
    expect(container.querySelectorAll('.day-inactive')).toHaveLength(4);
    expect(container.querySelectorAll('.day-inactive')[0]).toHaveAttribute('aria-hidden', 'true');
  });

  describe('moving between months', () => {
    it('goes to the next and the previous month', () => {
      render(<Calendar date={new Date(2026, 4, 12)} />);
      fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
      expect(screen.getByRole('button', { name: 'Jun 26' })).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
      fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
      expect(screen.getByRole('button', { name: 'Apr 26' })).toBeInTheDocument();
    });

    it('rolls over the year', () => {
      render(<Calendar date={new Date(2026, 11, 5)} />);
      fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
      expect(screen.getByRole('button', { name: 'Jan 27' })).toBeInTheDocument();
    });

    it('stays in February when moving on from January 31st', () => {
      render(<Calendar date={new Date(2026, 0, 31)} />);
      fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
      expect(screen.getByRole('button', { name: 'Feb 26' })).toBeInTheDocument();
      expect(dayButtons()).toHaveLength(28);
    });

    it('returns to the current month from the month title', () => {
      const today = new Date();
      render(<Calendar date={new Date(2020, 5, 3)} />);
      expect(screen.getByRole('button', { name: 'Jun 20' })).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Jun 20' }));
      const title = `${new Dater(today).monthName().substr(0, 3)} ${String(today.getFullYear()).substr(2)}`;
      expect(screen.getByRole('button', { name: title })).toBeInTheDocument();
    });
  });

  describe('choosing a day', () => {
    it('calls onDateSelect with a Dater for the day and highlights it', () => {
      const onDateSelect = jest.fn();
      render(<Calendar date={new Date(2026, 4, 12)} onDateSelect={onDateSelect} />);
      fireEvent.click(screen.getByRole('button', { name: 'May 20, 2026' }));

      expect(onDateSelect).toHaveBeenCalledTimes(1);
      const dater = onDateSelect.mock.calls[0][0];
      expect(dater).toBeInstanceOf(Dater);
      expect(dater.format()).toBe('5/20/2026');
      expect(screen.getByRole('button', { name: 'May 20, 2026' })).toHaveAttribute('aria-current', 'date');
      expect(screen.getByRole('button', { name: 'May 12, 2026' })).not.toHaveAttribute('aria-current');
    });

    it('works without an onDateSelect', () => {
      render(<Calendar date={new Date(2026, 4, 12)} />);
      fireEvent.click(screen.getByRole('button', { name: 'May 3, 2026' }));
      expect(screen.getByRole('button', { name: 'May 3, 2026' })).toHaveAttribute('aria-current', 'date');
    });

    it('ignores clicks on the blank cells before the 1st', () => {
      const onDateSelect = jest.fn();
      const { container } = render(<Calendar date={new Date(2026, 4, 12)} onDateSelect={onDateSelect} />);
      fireEvent.click(container.querySelector('.day-inactive'));
      expect(onDateSelect).not.toHaveBeenCalled();
      expect(screen.getByRole('button', { name: 'May 26' })).toBeInTheDocument();
    });
  });

  describe('the date prop', () => {
    it('does not change the Date it was given', () => {
      const date = new Date(2026, 4, 12);
      render(<Calendar date={date} />);
      fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
      fireEvent.click(screen.getByRole('button', { name: 'June 20, 2026' }));
      expect(date.getTime()).toBe(new Date(2026, 4, 12).getTime());
    });

    it('moves to a new date when the prop changes', () => {
      const { rerender } = render(<Calendar date={new Date(2024, 1, 29)} />);
      expect(screen.getByRole('button', { name: 'Feb 24' })).toBeInTheDocument();
      rerender(<Calendar date={new Date(2027, 0, 1)} />);
      expect(screen.getByRole('button', { name: 'Jan 27' })).toBeInTheDocument();
    });

    it('keeps the month the user navigated to when the same date is passed again', () => {
      const { rerender } = render(<Calendar date={new Date(2026, 4, 12)} />);
      fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
      rerender(<Calendar date={new Date(2026, 4, 12)} />);
      expect(screen.getByRole('button', { name: 'Jun 26' })).toBeInTheDocument();
    });

    it('falls back to the current month for a date it cannot read', () => {
      const today = new Date();
      render(<Calendar date="not a date" />);
      expect(screen.getByRole('button', {
        name: `${new Dater(today).monthName()} ${today.getDate()}, ${today.getFullYear()}`
      })).toHaveAttribute('aria-current', 'date');
    });
  });

  it('keeps the arrows and the month title in the header', () => {
    const { container } = render(<Calendar date={new Date(2026, 4, 12)} />);
    const header = container.querySelector('.volta-calendar > div');
    expect(within(header).getAllByRole('button')).toHaveLength(3);
  });
});
