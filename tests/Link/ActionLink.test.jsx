import { createEvent, render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Link, { ActionLink } from '../../components/Link/Link';

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
    expect(link).toHaveClass('volta-link', 'volta-link--action', 'extra');
  });

  it('has just the base class when no className is given', () => {
    render(
      <MemoryRouter>
        <ActionLink to="/settings">Settings</ActionLink>
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Settings' }).className).toBe('volta-link volta-link--action');
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

  it('fills :name segments from params, like Link', () => {
    render(
      <MemoryRouter>
        <ActionLink to="/users/:id" params={{ id: 42 }}>Profile</ActionLink>
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/users/42');
  });

  it('navigates on the client instead of loading the page', () => {
    const { container } = render(
      <MemoryRouter>
        <ActionLink to="/x">Go</ActionLink>
      </MemoryRouter>
    );
    const event = createEvent.click(screen.getByRole('link', { name: 'Go' }), { bubbles: true, cancelable: true });
    fireEvent(screen.getByRole('link', { name: 'Go' }), event);
    // React Router handles a plain left click itself and stops the browser's navigation
    expect(event.defaultPrevented).toBe(true);
    expect(container).toBeInTheDocument();
  });
});

describe('Link variant and router', () => {
  it('is a plain anchor with just the base class by default', () => {
    render(<Link to="/plain">Plain</Link>);
    const link = screen.getByRole('link', { name: 'Plain' });
    expect(link.className).toBe('volta-link');
    const event = createEvent.click(link, { bubbles: true, cancelable: true });
    fireEvent(link, event);
    expect(event.defaultPrevented).toBe(false);
  });

  it('takes the action look on its own, without a router', () => {
    render(<Link to="/plain" variant="action">Quiet</Link>);
    expect(screen.getByRole('link', { name: 'Quiet' })).toHaveClass('volta-link', 'volta-link--action');
  });

  it('lists its variants', () => {
    expect(Link.variants).toEqual(['link', 'action']);
  });

  it('routes a plain-look link too when asked', () => {
    render(
      <MemoryRouter>
        <Link router to={{ pathname: '/search', search: '?q=a' }}>Search</Link>
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute('href', '/search?q=a');
    expect(screen.getByRole('link', { name: 'Search' }).className).toBe('volta-link');
  });
});
