import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import TabsRouted from '../../components/TabsRouted/TabsRouted';

const tabs = [
  { path: '/', name: 'Overview' },
  { path: '/reports', name: 'Reports' },
  { path: '/settings', name: 'Settings' }
];

const renderTabs = (path = '/') => render(
  <MemoryRouter initialEntries={[path]}>
    <TabsRouted tabs={tabs} />
  </MemoryRouter>
);

describe('TabsRouted', () => {
  it('renders without crashing', () => {
    const { container } = render(<MemoryRouter><TabsRouted /></MemoryRouter>);
    expect(container).toBeInTheDocument();
  });

  it('renders a link per tab', () => {
    renderTabs();
    expect(screen.getAllByRole('link')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'Reports' })).toHaveAttribute('href', '/reports');
  });

  it('marks the tab for the current path as active', () => {
    renderTabs('/reports');
    expect(screen.getByRole('link', { name: 'Reports' })).toHaveClass('is-active');
    expect(screen.getByRole('link', { name: 'Reports' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveClass('is-active');
  });

  it('matches nested paths but keeps the "/" tab for the root only', () => {
    renderTabs('/reports/weekly');
    expect(screen.getByRole('link', { name: 'Reports' })).toHaveClass('is-active');
    expect(screen.getByRole('link', { name: 'Overview' })).not.toHaveClass('is-active');
  });

  it('moves the active tab when one is clicked', () => {
    renderTabs('/');
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveClass('is-active');
    fireEvent.click(screen.getByRole('link', { name: 'Settings' }));
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveClass('is-active');
    expect(screen.getByRole('link', { name: 'Overview' })).not.toHaveClass('is-active');
  });

  it('renders without React warnings (no unknown DOM props)', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    renderTabs('/reports');
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
