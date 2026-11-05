import { render, screen } from '@testing-library/react';

import ErrorList from '../../components/Message/ErrorList';

describe('ErrorList', () => {
  it('renders an empty list without errors, even when none are given', () => {
    const { container } = render(<ErrorList />);
    expect(container.querySelector('ul')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('renders an empty list when errors is null', () => {
    render(<ErrorList errors={null} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('shows one item per field, with the capitalised field name', () => {
    render(<ErrorList errors={{ email: 'Enter a valid email.', password: 'Too short.' }} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Email: Enter a valid email.');
    expect(items[1]).toHaveTextContent('Password: Too short.');
  });

  it('shows non_field_errors without a field label', () => {
    render(<ErrorList errors={{ non_field_errors: 'Unable to log in.' }} />);
    const item = screen.getByRole('listitem');
    expect(item).toHaveTextContent('Unable to log in.');
    expect(item.querySelector('strong')).toBeNull();
  });

  it('joins several messages for one field with a space', () => {
    render(<ErrorList errors={{ username: ['Too short.', 'Already taken.'] }} />);
    expect(screen.getByRole('listitem')).toHaveTextContent('Username: Too short. Already taken.');
  });

  it('hides the decorative dot from assistive tech and styles it from a class, not inline', () => {
    const { container } = render(<ErrorList errors={{ email: 'Required.' }} />);
    const dot = container.querySelector('.volta-error_list-dot');
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    expect(dot).not.toHaveAttribute('style');
  });
});
