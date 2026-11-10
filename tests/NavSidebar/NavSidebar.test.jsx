import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import NavSidebar from '../../components/NavSidebar/NavSidebar';
import NavItem from '../../components/NavSidebar/NavItem';

const renderNav = (props, path = '/') => render(
  <MemoryRouter initialEntries={[path]}>
    <NavSidebar {...props} />
  </MemoryRouter>
);

const buildGroup = () => {
  const reports = new NavItem('Reports');
  reports.add(new NavItem('Weekly', '/reports/weekly'));
  return reports;
};

describe('NavItem', () => {
  it('has a link only when linkTo has text', () => {
    expect(new NavItem('Home', '/').hasLink()).toBe(true);
    expect(new NavItem('Group').hasLink()).toBe(false);
    expect(new NavItem('Group', '   ').hasLink()).toBe(false);
  });

  it('starts expanded, knows its children and uses the title as key', () => {
    const group = buildGroup();
    expect(group.isExpanded()).toBe(true);
    expect(group.hasChildren()).toBe(true);
    expect(group.key).toBe('Reports');
    group.setExpanded(false);
    expect(group.isExpanded()).toBe(false);
  });
});

describe('NavSidebar', () => {
  it('renders without crashing', () => {
    const { container } = renderNav();
    expect(container).toBeInTheDocument();
  });

  it('renders nothing but the container with no items', () => {
    const { container } = renderNav({ navItems: [] });
    expect(container.querySelector('.volta-nav_sidebar')).toBeEmptyDOMElement();
  });

  it('renders linked items as links, including their query', () => {
    const search = new NavItem('Search', '/search');
    search.query = { q: 'volta' };
    renderNav({ navItems: [new NavItem('Home', '/'), search] });
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute('href', '/search?q=volta');
  });

  it('marks the item matching the current path as active', () => {
    renderNav({ navItems: [new NavItem('Home', '/'), new NavItem('Projects', '/projects')] }, '/projects');
    expect(screen.getByRole('link', { name: 'Projects' }).parentElement).toHaveClass('is-active');
    expect(screen.getByRole('link', { name: 'Home' }).parentElement).not.toHaveClass('is-active');
  });

  it('adds the extra class of an item', () => {
    renderNav({ navItems: [new NavItem('Home', '/', null, 'special')] });
    expect(screen.getByRole('link', { name: 'Home' }).parentElement).toHaveClass('special');
  });

  it('reports the active item to onActiveState', () => {
    const onActiveState = jest.fn();
    const projects = new NavItem('Projects', '/projects');
    renderNav({ navItems: [new NavItem('Home', '/'), projects], onActiveState }, '/projects');
    expect(onActiveState).toHaveBeenCalledWith(projects);
  });

  it('lets onActiveState set state in the parent without React warnings', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const Parent = () => {
      const [active, setActive] = React.useState(null);
      return (
        <MemoryRouter initialEntries={['/']}>
          <NavSidebar navItems={[new NavItem('Home', '/')]} onActiveState={setActive} />
          <p>Active: {active ? active.title : 'none'}</p>
        </MemoryRouter>
      );
    };
    render(<Parent />);
    expect(screen.getByText('Active: Home')).toBeInTheDocument();
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('shows the children of an expanded group, indented', () => {
    renderNav({ navItems: [buildGroup()] });
    expect(screen.getByRole('button', { name: /Reports/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Weekly' }).parentElement).toHaveClass('navlevel-indent-1');
  });

  it('hides the children of a collapsed group', () => {
    const group = buildGroup();
    group.setExpanded(false);
    renderNav({ navItems: [group] });
    expect(screen.getByRole('button', { name: /Reports/ })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Weekly' })).not.toBeInTheDocument();
  });

  it('toggles a group by click and by keyboard', () => {
    renderNav({ navItems: [buildGroup()] });
    const toggle = screen.getByRole('button', { name: /Reports/ });

    fireEvent.click(toggle);
    expect(screen.queryByRole('link', { name: 'Weekly' })).not.toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('button', { name: /Reports/ }), { key: 'Enter' });
    expect(screen.getByRole('link', { name: 'Weekly' })).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('button', { name: /Reports/ }), { key: ' ' });
    expect(screen.queryByRole('link', { name: 'Weekly' })).not.toBeInTheDocument();
  });

  it('renders an item without a link or children as plain text', () => {
    renderNav({ navItems: [new NavItem('Heading')] });
    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
