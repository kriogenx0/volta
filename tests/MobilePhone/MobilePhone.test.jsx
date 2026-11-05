import { render, screen } from '@testing-library/react';

import MobilePhone from '../../components/MobilePhone/MobilePhone';

describe('MobilePhone', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders without crashing', () => {
    const { container } = render(<MobilePhone />);
    expect(container).toBeInTheDocument();
  });

  it('shows an empty screen when it has no children', () => {
    const { container } = render(<MobilePhone />);
    expect(container.querySelector('.phone-display')).toBeEmptyDOMElement();
  });

  it('shows its children on the phone screen', () => {
    const { container } = render(<MobilePhone><p>Hello from the app</p></MobilePhone>);
    expect(container.querySelector('.phone-display')).toContainElement(screen.getByText('Hello from the app'));
  });

  it('draws the speaker, status bar and home button around the screen', () => {
    const { container } = render(<MobilePhone />);
    ['.phone-speaker', '.phone-status_bar', '.phone-display', '.phone-button'].forEach((selector) => {
      expect(container.querySelector(`.volta-mobile_phone .phone-outside ${selector}`)).toBeInTheDocument();
    });
  });

  it('hides the decoration from screen readers but keeps the screen', () => {
    const { container } = render(<MobilePhone><button type="button">Tap</button></MobilePhone>);
    expect(container.querySelector('.phone-speaker')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.phone-status_bar')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.phone-button')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('button', { name: 'Tap' })).toBeInTheDocument();
  });

  describe('status bar clock', () => {
    const clockAt = (hours, minutes) => {
      jest.useFakeTimers().setSystemTime(new Date(2024, 0, 15, hours, minutes));
      const { container } = render(<MobilePhone />);
      return container.querySelector('.phone-status_bar').textContent;
    };

    it('shows a morning time without a leading zero on the hour', () => {
      expect(clockAt(9, 7)).toBe('9:07');
    });

    it('shows an afternoon time on a 12-hour clock', () => {
      expect(clockAt(13, 30)).toBe('1:30');
    });

    it('shows midnight as 12, not 0', () => {
      expect(clockAt(0, 5)).toBe('12:05');
    });

    it('shows noon as 12, not 0', () => {
      expect(clockAt(12, 0)).toBe('12:00');
    });

    it('pads the minutes', () => {
      expect(clockAt(23, 9)).toBe('11:09');
    });
  });
});
