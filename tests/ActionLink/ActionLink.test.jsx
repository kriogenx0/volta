import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ActionLink from '../../components/ActionLink/ActionLink';

describe('ActionLink', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <ActionLink to="/">Link</ActionLink>
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });

  it('links to the target and keeps a custom class', () => {
    render(
      <MemoryRouter>
        <ActionLink to="/settings" className="extra">Settings</ActionLink>
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).toHaveAttribute('href', '/settings');
    expect(link).toHaveClass('volta-action_link', 'extra');
  });

  it('has just the base class when no className is given', () => {
    render(
      <MemoryRouter>
        <ActionLink to="/settings">Settings</ActionLink>
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Settings' }).className).toBe('volta-action_link');
  });

  it('accepts a path object as the target', () => {
    render(
      <MemoryRouter>
        <ActionLink to={{ pathname: '/search', search: '?q=volta' }}>Search</ActionLink>
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute('href', '/search?q=volta');
  });

  it('passes onClick through', () => {
    const onClick = jest.fn();
    render(
      <MemoryRouter>
        <ActionLink to="/x" onClick={onClick}>Go</ActionLink>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('link', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
