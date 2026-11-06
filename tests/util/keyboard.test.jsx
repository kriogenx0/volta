import { render, screen, fireEvent } from '@testing-library/react';

import asButton from '../../util/keyboard';

const Box = ({ onActivate }) => (
  <div data-testid="box" {...asButton(onActivate)}>
    <input aria-label="Inside" />
    Choose
  </div>
);

describe('asButton', () => {
  it('makes an element a button with a tab stop', () => {
    render(<Box onActivate={() => {}} />);
    const box = screen.getByRole('button', { name: /Choose/ });
    expect(box).toHaveAttribute('tabindex', '0');
    box.focus();
    expect(box).toHaveFocus();
  });

  it('activates on a click', () => {
    const onActivate = jest.fn();
    render(<Box onActivate={onActivate} />);
    fireEvent.click(screen.getByTestId('box'));
    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it.each([['Enter'], [' ']])('activates on %p, without the page reacting to it', (key) => {
    const onActivate = jest.fn();
    render(<Box onActivate={onActivate} />);
    const notPrevented = fireEvent.keyDown(screen.getByTestId('box'), { key });
    expect(onActivate).toHaveBeenCalledTimes(1);
    expect(notPrevented).toBe(false); // preventDefault: Space must not scroll the page
  });

  it('ignores other keys', () => {
    const onActivate = jest.fn();
    render(<Box onActivate={onActivate} />);
    const notPrevented = fireEvent.keyDown(screen.getByTestId('box'), { key: 'a' });
    expect(onActivate).not.toHaveBeenCalled();
    expect(notPrevented).toBe(true);
  });

  it('leaves keys pressed on something inside it alone', () => {
    const onActivate = jest.fn();
    render(<Box onActivate={onActivate} />);
    fireEvent.keyDown(screen.getByLabelText('Inside'), { key: ' ' });
    expect(onActivate).not.toHaveBeenCalled();
  });
});
