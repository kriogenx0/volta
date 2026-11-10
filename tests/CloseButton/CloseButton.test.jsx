import { render, screen, fireEvent } from '@testing-library/react';

import CloseButton from '../../components/CloseButton';

describe('CloseButton', () => {
  it('renders without crashing', () => {
    const { container } = render(<CloseButton />);
    expect(container).toBeInTheDocument();
  });

  // The module resolved from '../CloseButton' once differed from the one the
  // styles target (index.js vs index.jsx), leaving the button unstyled.
  it('carries the class its stylesheet targets', () => {
    render(<CloseButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('volta-close_button');
    expect(button).toHaveClass('button-link');
  });

  it('has an accessible name even though it only shows an icon', () => {
    render(<CloseButton />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('lets the caller say what it closes', () => {
    render(<CloseButton aria-label="Dismiss notification" />);
    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('hides the glyph from assistive tech', () => {
    const { container } = render(<CloseButton />);
    expect(container.querySelector('.volta-icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('calls onClick', () => {
    const onClick = jest.fn();
    render(<CloseButton onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const onClick = jest.fn();
    render(<CloseButton disabled onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Close' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  describe('size', () => {
    it('is the large one by default', () => {
      render(<CloseButton />);
      expect(screen.getByRole('button')).not.toHaveClass('close_button-sm');
    });

    it('has a compact one for dialog headers', () => {
      render(<CloseButton size="sm" />);
      expect(screen.getByRole('button')).toHaveClass('volta-close_button', 'close_button-sm');
    });
  });

  describe('className', () => {
    // It used to replace volta-close_button, which dropped the button's styling.
    it('adds to the button\'s own classes instead of replacing them', () => {
      render(<CloseButton className="modal-x" />);
      expect(screen.getByRole('button')).toHaveClass('volta-close_button', 'button-link', 'modal-x');
    });
  });

  it('passes other attributes through to the button', () => {
    render(<CloseButton data-dismiss="dialog" />);
    expect(screen.getByRole('button')).toHaveAttribute('data-dismiss', 'dialog');
  });
});

describe('CloseButton icon', () => {
  it('is the xmark icon, hidden from assistive technology', () => {
    const { container } = render(<CloseButton />);
    const icon = container.querySelector('.volta-icon');
    expect(icon).toHaveAttribute('data-type', 'xmark');
    expect(icon).toHaveClass('icon-svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
