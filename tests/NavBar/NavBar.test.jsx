import { render, screen, fireEvent } from '@testing-library/react';

import NavBar, { GlobalNav } from '../../components/NavBar/NavBar';

const links = { Home: '/', Dashboard: '/dashboard', Reports: '/reports' };

describe('NavBar', () => {
  it('renders without crashing', () => {
    const { container } = render(<NavBar />);
    expect(container).toBeInTheDocument();
  });

  it('shows the app name linking home, with an optional subtitle', () => {
    render(<NavBar appName="My App" appSubtitle="Beta" />);
    const name = screen.getByRole('link', { name: /My App/ });
    expect(name).toHaveAttribute('href', '/');
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('uses homeLink for the app name link', () => {
    render(<NavBar appName="My App" homeLink="/start" />);
    expect(screen.getByRole('link', { name: 'My App' })).toHaveAttribute('href', '/start');
  });

  it('renders a link per entry in links, using string values as the href', () => {
    render(<NavBar links={links} />);
    expect(screen.getAllByRole('link')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'Reports' })).toHaveAttribute('href', '/reports');
  });

  it('renders links whose values are objects without duplicate-key warnings', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<NavBar links={{ Home: {}, Dashboard: {}, Reports: {} }} />);
    // Object values have no URL, so these anchors have an empty href and no link role.
    expect(container.querySelectorAll('a.nav-link')).toHaveLength(3);
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('marks only the active link', () => {
    render(<NavBar links={links} activeLinkKey="Dashboard" />);
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveClass('active');
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveClass('active');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('calls onLinkClick with the link and key instead of following the href', () => {
    const onLinkClick = jest.fn();
    render(<NavBar links={links} onLinkClick={onLinkClick} />);
    const notPrevented = fireEvent.click(screen.getByRole('link', { name: 'Reports' }));
    expect(onLinkClick).toHaveBeenCalledWith('/reports', 'Reports');
    expect(notPrevented).toBe(false);
  });

  it('lets the browser follow the href when there is no onLinkClick', () => {
    render(<NavBar links={links} />);
    expect(fireEvent.click(screen.getByRole('link', { name: 'Reports' }))).toBe(true);
  });

  it('is a header with the navbar class', () => {
    const { container } = render(<NavBar appName="My App" />);
    expect(container.querySelector('header.volta-navbar')).toBeInTheDocument();
  });

  it('GlobalNav is NavBar itself', () => {
    expect(GlobalNav).toBe(NavBar);
  });
});
