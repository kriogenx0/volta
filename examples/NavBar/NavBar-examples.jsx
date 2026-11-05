import { useState } from 'react';

import NavBar from '../../components/NavBar/NavBar';
import NavItem from '../../components/NavBar/NavItem';

// NavItem(title, linkTo, key, extraClass); add() nests a child under a group.
// A group without a linkTo toggles open and closed instead of navigating.
const buildFlatNav = () => [
  new NavItem('Overview', '/'),
  new NavItem('Projects', '/projects'),
  new NavItem('Settings', '/settings')
];

const buildGroupedNav = () => {
  const reports = new NavItem('Reports');
  reports.add(new NavItem('Weekly', '/reports/weekly'));
  reports.add(new NavItem('Monthly', '/reports/monthly'));

  const admin = new NavItem('Admin');
  admin.add(new NavItem('Users', '/admin/users'));
  admin.setExpanded(false);

  return [new NavItem('Overview', '/'), reports, admin];
};

const Flat = () => {
  const [items] = useState(buildFlatNav);
  return <NavBar navItems={items} />;
};

const Grouped = () => {
  const [items] = useState(buildGroupedNav);
  return <NavBar navItems={items} />;
};

const ActiveReport = () => {
  const [items] = useState(buildFlatNav);
  const [active, setActive] = useState(null);
  return (
    <div className="example-stack">
      <NavBar navItems={items} onActiveState={setActive} />
      <p>Active: {active ? active.title : 'none'}</p>
    </div>
  );
};

export default {
  name: 'NavBar',
  description: 'A vertical, router-aware navigation list built from NavItem objects. Items with a linkTo are links (the one matching the current path is highlighted), items with children and no link toggle open and closed, and onActiveState reports the active item.',
  examples: [
    {
      name: 'Links',
      code: `const items = [
  new NavItem('Overview', '/'),
  new NavItem('Projects', '/projects'),
  new NavItem('Settings', '/settings')
];

<NavBar navItems={items} />`,
      output: <Flat />
    },
    {
      name: 'Collapsible groups',
      code: `const reports = new NavItem('Reports');
reports.add(new NavItem('Weekly', '/reports/weekly'));
reports.add(new NavItem('Monthly', '/reports/monthly'));

const admin = new NavItem('Admin');
admin.add(new NavItem('Users', '/admin/users'));
admin.setExpanded(false); // starts closed

<NavBar navItems={[new NavItem('Overview', '/'), reports, admin]} />`,
      output: <Grouped />
    },
    {
      name: 'Reporting the active item',
      code: `const [active, setActive] = useState(null);

<NavBar navItems={items} onActiveState={setActive} />
<p>Active: {active ? active.title : 'none'}</p>`,
      output: <ActiveReport />
    },
    {
      name: 'Empty',
      code: '<NavBar navItems={[]} />',
      output: <NavBar navItems={[]} />
    }
  ]
};
