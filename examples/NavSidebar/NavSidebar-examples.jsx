import { useState } from 'react';

import NavSidebar from '../../components/NavSidebar/NavSidebar';
import NavItem from '../../components/NavSidebar/NavItem';

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
  return <NavSidebar navItems={items} />;
};

const Grouped = () => {
  const [items] = useState(buildGroupedNav);
  return <NavSidebar navItems={items} />;
};

const ActiveReport = () => {
  const [items] = useState(buildFlatNav);
  const [active, setActive] = useState(null);
  return (
    <div className="example-stack">
      <NavSidebar navItems={items} onActiveState={setActive} />
      <p>Active: {active ? active.title : 'none'}</p>
    </div>
  );
};

export default {
  name: 'NavSidebar',
  description: 'The side navigation: a vertical, router-aware list built from NavItem objects. Items with a linkTo are links (the one matching the current path is highlighted), items with children and no link toggle open and closed, and onActiveState reports the active item.',
  examples: [

    {
      name: 'Links',
      code: `const items = [
  new NavItem('Overview', '/'),
  new NavItem('Projects', '/projects'),
  new NavItem('Settings', '/settings')
];

<NavSidebar navItems={items} />`,
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

<NavSidebar navItems={[new NavItem('Overview', '/'), reports, admin]} />`,
      output: <Grouped />
    },
    {
      name: 'Reporting the active item',
      code: `const [active, setActive] = useState(null);

<NavSidebar navItems={items} onActiveState={setActive} />
<p>Active: {active ? active.title : 'none'}</p>`,
      output: <ActiveReport />
    },
    {
      name: 'Empty',
      code: '<NavSidebar navItems={[]} />',
      output: <NavSidebar navItems={[]} />
    }
  ]
};
