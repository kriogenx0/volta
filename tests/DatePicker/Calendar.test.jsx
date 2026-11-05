import { render, screen, fireEvent } from '@testing-library/react';

import Calendar from '../../components/DatePicker/Calendar';
import Dater from '../../components/DatePicker/Dater';

const days = () => screen.getAllByRole('button', { name: /^[A-Z][a-z]+ \d{1,2}, \d{4}$/ });
const heading = () => document.querySelector('.cal-month').textContent;

describe('Calendar', () => {
  it('renders without crashing', () => {
    const { container } = render(<Calendar />);
    expect(container).toBeInTheDocument();
  });

  it('shows the month of the date, with one button per day', () => {
    render(<Calendar date={new Date(2026, 5, 15)} />);
    expect(heading()).toBe('Jun 26');
    expect(days()).toHaveLength(30);
    expect(days()[0]).toHaveAccessibleName('June 1, 2026');
  });

  it('shows all 31 days of a month when the date is the 31st', () => {
    render(<Calendar date={new Date(2026, 0, 31)} />);
    expect(days()).toHaveLength(31);
  });

  it('starts on the current month without a date', () => {
    render(<Calendar />);
    const now = new Date();
    expect(days()[0].getAttribute('aria-label')).toMatch(new RegExp(`${now.getFullYear()}$`));
  });

  it('does not crash on an invalid date', () => {
    render(<Calendar date={new Date('nope')} />);
    expect(days().length).toBeGreaterThan(27);
  });

  describe('highlighted day', () => {
    it('marks the date as pressed', () => {
      render(<Calendar date={new Date(2026, 5, 15)} />);
      expect(screen.getByRole('button', { name: 'June 15, 2026' })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByRole('button', { name: 'June 16, 2026' })).toHaveAttribute('aria-pressed', 'false');
    });

    it('marks nothing without a date', () => {
      render(<Calendar />);
      expect(days().filter((d) => d.getAttribute('aria-pressed') === 'true')).toHaveLength(0);
    });

    it('does not carry the day number into other months', () => {
      render(<Calendar date={new Date(2026, 5, 15)} />);
      fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
      expect(heading()).toBe('Jul 26');
      expect(days().filter((d) => d.getAttribute('aria-pressed') === 'true')).toHaveLength(0);
      fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
      expect(screen.getByRole('button', { name: 'June 15, 2026' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('moves to a clicked day', () => {
      render(<Calendar date={new Date(2026, 5, 15)} />);
      fireEvent.click(screen.getByRole('button', { name: 'June 22, 2026' }));
      expect(screen.getByRole('button', { name: 'June 22, 2026' })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByRole('button', { name: 'June 15, 2026' })).toHaveAttribute('aria-pressed', 'false');
    });

    it('follows a new date prop', () => {
      const { rerender } = render(<Calendar date={new Date(2026, 5, 15)} />);
      rerender(<Calendar date={new Date(2026, 8, 3)} />);
      expect(heading()).toBe('Sep 26');
      expect(screen.getByRole('button', { name: 'September 3, 2026' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('keeps the month the user paged to when the parent re-renders with the same date', () => {
      const { rerender } = render(<Calendar date={new Date(2026, 5, 15)} />);
      fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
      rerender(<Calendar date={new Date(2026, 5, 15)} />);
      expect(heading()).toBe('Jul 26');
    });
  });

  describe('paging', () => {
    it('names the arrow buttons', () => {
      render(<Calendar date={new Date(2026, 5, 15)} />);
      expect(screen.getByRole('button', { name: 'Previous month' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument();
    });

    it('goes back and forward across a year end', () => {
      render(<Calendar date={new Date(2026, 11, 10)} />);
      fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
      expect(heading()).toBe('Jan 27');
      fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
      fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
      expect(heading()).toBe('Nov 26');
    });

    it('does not skip February when paging from the 31st', () => {
      render(<Calendar date={new Date(2026, 0, 31)} />);
      fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
      expect(heading()).toBe('Feb 26');
      expect(days()).toHaveLength(28);
    });

    it('does not change the date it was given', () => {
      const date = new Date(2026, 5, 15);
      render(<Calendar date={date} />);
      fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
      fireEvent.click(screen.getByRole('button', { name: 'July 1, 2026' }));
      expect(date.getMonth()).toBe(5);
      expect(date.getDate()).toBe(15);
    });

    it('jumps to the current month from the heading', () => {
      render(<Calendar date={new Date(2020, 1, 10)} />);
      expect(heading()).toBe('Feb 20');
      fireEvent.click(screen.getByTitle('Show the current month'));
      const now = new Date();
      expect(heading()).toMatch(String(now.getFullYear()).substr(2));
    });
  });

  describe('choosing', () => {
    it('calls onDateSelect with a Date for the clicked day', () => {
      const onDateSelect = jest.fn();
      render(<Calendar date={new Date(2026, 5, 15)} onDateSelect={onDateSelect} />);
      fireEvent.click(screen.getByRole('button', { name: 'June 9, 2026' }));

      const chosen = onDateSelect.mock.calls[0][0];
      expect(chosen).toBeInstanceOf(Date);
      expect([chosen.getFullYear(), chosen.getMonth(), chosen.getDate()]).toEqual([2026, 5, 9]);
    });

    it('selects a day in the month that was paged to', () => {
      const onDateSelect = jest.fn();
      render(<Calendar date={new Date(2026, 5, 15)} onDateSelect={onDateSelect} />);
      fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
      fireEvent.click(screen.getByRole('button', { name: 'July 4, 2026' }));
      expect(onDateSelect.mock.calls[0][0].getMonth()).toBe(6);
    });

    it('works without onDateSelect', () => {
      render(<Calendar date={new Date(2026, 5, 15)} />);
      expect(() => fireEvent.click(screen.getByRole('button', { name: 'June 9, 2026' }))).not.toThrow();
    });
  });

  describe('limits', () => {
    it('disables days before minDate and after maxDate', () => {
      render(<Calendar date={new Date(2026, 5, 15)} minDate={new Date(2026, 5, 10)} maxDate={new Date(2026, 5, 20)} />);
      expect(screen.getByRole('button', { name: 'June 9, 2026' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'June 21, 2026' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'June 15, 2026' })).toBeEnabled();
    });

    it('counts the limit days whole, whatever the time of day', () => {
      render(
        <Calendar
          date={new Date(2026, 5, 15, 9, 30)}
          minDate={new Date(2026, 5, 10, 23, 59)}
          maxDate={new Date(2026, 5, 20, 0, 1)}
        />
      );
      expect(screen.getByRole('button', { name: 'June 10, 2026' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'June 20, 2026' })).toBeEnabled();
    });

    it('lets today be chosen when minDate is the current moment', () => {
      const now = new Date();
      render(<Calendar minDate={now} />);
      const today = days().find((d) => d.getAttribute('aria-label') === `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now)} ${now.getDate()}, ${now.getFullYear()}`);
      expect(today).toBeEnabled();
    });

    it('does not select a disabled day', () => {
      const onDateSelect = jest.fn();
      render(<Calendar date={new Date(2026, 5, 15)} minDate={new Date(2026, 5, 10)} onDateSelect={onDateSelect} />);
      fireEvent.click(screen.getByRole('button', { name: 'June 9, 2026' }));
      expect(onDateSelect).not.toHaveBeenCalled();
    });
  });
});

describe('Dater', () => {
  it('works on its own copy of the date', () => {
    const date = new Date(2026, 5, 15);
    const dater = new Dater(date);
    dater.nextMonth().day(3);
    expect(date.getMonth()).toBe(5);
    expect(date.getDate()).toBe(15);
  });

  it('copies another Dater', () => {
    const a = new Dater(new Date(2026, 5, 15));
    const b = new Dater(a);
    b.nextMonth();
    expect(a.month()).toBe(6);
  });

  it('falls back to today for an unreadable date', () => {
    expect(new Dater(new Date('nope')).year()).toBe(new Date().getFullYear());
  });

  it('keeps the last day of a shorter month when paging from the 31st', () => {
    expect(new Dater(new Date(2026, 0, 31)).nextMonth().mdy()).toBe('2/28/2026');
    expect(new Dater(new Date(2028, 0, 31)).nextMonth().mdy()).toBe('2/29/2028');
    expect(new Dater(new Date(2026, 2, 31)).previousMonth().mdy()).toBe('2/28/2026');
  });

  it('counts the days of the month it is in, whatever the day', () => {
    expect(new Dater(new Date(2026, 0, 31)).daysInMonth()).toBe(31);
    expect(new Dater(new Date(2026, 9, 31)).daysInMonth()).toBe(31);
    expect(new Dater(new Date(2026, 1, 28)).daysInMonth()).toBe(28);
    expect(new Dater(new Date(2028, 1, 10)).daysInMonth()).toBe(29);
  });
});
