import { render, screen } from '@testing-library/react';

import Message from '../../components/Message/Message';

describe('Message', () => {
  it('renders without crashing', () => {
    const { container } = render(<Message type="success" message="Saved" />);
    expect(container).toBeInTheDocument();
  });

  it('shows a success message with its icon and a polite status role', () => {
    const { container } = render(<Message type="success" message="Saved" />);
    const message = screen.getByRole('status');
    expect(message).toHaveTextContent('Saved');
    expect(message).toHaveClass('volta-message', 'volta-message-success');
    expect(container.querySelector('i.icon-check-circle')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('i.icon-check-circle svg path')).toBeInTheDocument();
  });

  it('shows an error message with its icon and an alert role', () => {
    const { container } = render(<Message type="error" message="Could not save" />);
    const message = screen.getByRole('alert');
    expect(message).toHaveTextContent('Could not save');
    expect(message).toHaveClass('volta-message', 'volta-message-error');
    expect(container.querySelector('i.icon-times-circle svg path')).toBeInTheDocument();
  });

  it('shows children when there is no message', () => {
    render(<Message type="success">Invite sent to <strong>ada@example.com</strong></Message>);
    expect(screen.getByText('ada@example.com').tagName).toBe('STRONG');
    expect(screen.getByRole('status')).toHaveTextContent('Invite sent to ada@example.com');
  });

  it('prefers the message over children', () => {
    render(<Message type="error" message="From message">From children</Message>);
    expect(screen.getByRole('alert')).toHaveTextContent('From message');
    expect(screen.queryByText('From children')).not.toBeInTheDocument();
  });

  it('shows a plain message when the type is missing', () => {
    const { container } = render(<Message message="Heads up" />);
    expect(screen.getByText('Heads up')).toHaveClass('volta-message');
    expect(container.querySelector('i')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('shows a plain message for an unknown type', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<Message type="warning" message="Careful" />);
    consoleError.mockRestore();
    expect(screen.getByText('Careful')).toHaveClass('volta-message');
    expect(container.querySelector('.volta-message-warning')).toBeNull();
    expect(container.querySelector('i')).toBeNull();
  });

  it('does not treat inherited object keys as a type', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Message type="toString" message="Odd" />);
    consoleError.mockRestore();
    expect(screen.getByText('Odd')).toBeInTheDocument();
  });
});
