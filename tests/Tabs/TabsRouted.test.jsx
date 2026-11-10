import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Tabs, { TabsRouted } from '../../components/Tabs/Tabs';

const tabs = [
  { path: '/', name: 'Overview' },
  { path: '/reports', name: 'Reports' },
  { path: '/settings', name: 'Settings' }
];

const renderTabs = (path = '/') => render(
  <MemoryRouter initialEntries={[path]}>
    <Tabs tabs={tabs} />
  </MemoryRouter>
);

// A routed tab is selected while the route matches: the <li> says so, the link says it is the page
const isSelected = (name) => screen.getByRole('link', { name }).closest('li').classList.contains('tab-selected');

describe('Tabs with { path, name } tabs (what TabsRouted did)', () => {
  it('renders a link per tab, and a list rather than a tab list', () => {
    renderTabs();
    expect(screen.getAllByRole('link')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'Reports' })).toHaveAttribute('href', '/reports');
    expect(screen.queryByRole('tablist')).toBeNull();
    expect(screen.queryByRole('tab')).toBeNull();
  });

  it('marks the tab for the current path as selected', () => {
    renderTabs('/reports');
    expect(isSelected('Reports')).toBe(true);
    expect(screen.getByRole('link', { name: 'Reports' })).toHaveAttribute('aria-current', 'page');
    expect(isSelected('Settings')).toBe(false);
    expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveAttribute('aria-current');
  });

  it('matches nested paths but keeps the "/" tab for the root only', () => {
    renderTabs('/reports/weekly');
    expect(isSelected('Reports')).toBe(true);
    expect(isSelected('Overview')).toBe(false);
  });

  it('moves the selected tab when one is clicked', () => {
    renderTabs('/');
    expect(isSelected('Overview')).toBe(true);
    fireEvent.click(screen.getByRole('link', { name: 'Settings' }));
    expect(isSelected('Settings')).toBe(true);
    expect(isSelected('Overview')).toBe(false);
  });

  it('renders without React warnings (no unknown DOM props)', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    renderTabs('/reports');
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('accepts a label instead of a name, and a node as the label', () => {
    render(
      <MemoryRouter>
        <Tabs tabs={[{ path: '/a', label: 'Alpha' }, { path: '/b', name: <b>Beta</b> }]} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Alpha' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Beta' })).toBeInTheDocument();
  });

  it('TabsRouted is Tabs itself', () => {
    expect(TabsRouted).toBe(Tabs);
  });
});
