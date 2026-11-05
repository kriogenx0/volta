import { render, screen, fireEvent } from '@testing-library/react';

import GlobalNav from '../../components/GlobalNav/GlobalNav';

const links = { Home: '/', Dashboard: '/dashboard', Reports: '/reports' };

describe('GlobalNav', () => {
  it('renders without crashing', () => {
    const { container } = render(<GlobalNav />);
    expect(container).toBeInTheDocument();
  });

  it('shows the app name linking home, with an optional subtitle', () => {
    render(<GlobalNav appName="My App" appSubtitle="Beta" />);
    const name = screen.getByRole('link', { name: /My App/ });
    expect(name).toHaveAttribute('href', '/');
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('uses homeLink for the app name link', () => {
    render(<GlobalNav appName="My App" homeLink="/start" />);
    expect(screen.getByRole('link', { name: 'My App' })).toHaveAttribute('href', '/start');
  });

  it('renders a link per entry in links, using string values as the href', () => {
    render(<GlobalNav links={links} />);
    expect(screen.getAllByRole('link')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'Reports' })).toHaveAttribute('href', '/reports');
  });

  it('renders links whose values are objects without duplicate-key warnings', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<GlobalNav links={{ Home: {}, Dashboard: {}, Reports: {} }} />);
    // Object values have no URL, so these anchors have an empty href and no link role.
    expect(container.querySelectorAll('a.nav-link')).toHaveLength(3);
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('marks only the active link', () => {
    render(<GlobalNav links={links} activeLinkKey="Dashboard" />);
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveClass('active');
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveClass('active');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('calls onLinkClick with the link and key instead of following the href', () => {
    const onLinkClick = jest.fn();
    render(<GlobalNav links={links} onLinkClick={onLinkClick} />);
    const notPrevented = fireEvent.click(screen.getByRole('link', { name: 'Reports' }));
    expect(onLinkClick).toHaveBeenCalledWith('/reports', 'Reports');
    expect(notPrevented).toBe(false);
  });

  it('lets the browser follow the href when there is no onLinkClick', () => {
    render(<GlobalNav links={links} />);
    expect(fireEvent.click(screen.getByRole('link', { name: 'Reports' }))).toBe(true);
  });
});
