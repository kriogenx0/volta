import { render, screen } from '@testing-library/react';

import ErrorMessage, { ErrorText } from '../../components/ErrorMessage/ErrorMessage';
import * as library from '../../components';

describe('ErrorMessage', () => {
  it('renders without crashing', () => {
    const { container } = render(<ErrorMessage />);
    expect(container).toBeInTheDocument();
  });

  it('is a Message of type error: a card in the error colour with its icon and an alert role', () => {
    const { container } = render(<ErrorMessage message="Required" />);
    const card = screen.getByRole('alert');
    expect(card).toHaveTextContent('Required');
    expect(card).toHaveClass('volta-message', 'volta-message-error');
    expect(container.querySelector('.volta-icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('accepts markup as the message, or children', () => {
    const { rerender } = render(<ErrorMessage message={<>Use <strong>8 characters</strong></>} />);
    expect(screen.getByText('8 characters').tagName).toBe('STRONG');
    rerender(<ErrorMessage>Try again in <em>a minute</em></ErrorMessage>);
    expect(screen.getByText('a minute').tagName).toBe('EM');
  });

  it('can leave the live region off, for an error that is described to a control', () => {
    render(<ErrorMessage message="Required" role={null} />);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByText('Required')).toHaveClass('volta-message-error');
  });

  it('ErrorText is ErrorMessage itself, in the module and the library', () => {
    expect(ErrorText).toBe(ErrorMessage);
    expect(library.ErrorText).toBe(library.ErrorMessage);
  });
});
