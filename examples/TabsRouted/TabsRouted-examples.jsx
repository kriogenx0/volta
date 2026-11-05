import { useLocation } from 'react-router-dom';

import TabsRouted from '../../components/TabsRouted/TabsRouted';

const tabs = [
  { path: '/', name: 'Overview' },
  { path: '/reports', name: 'Reports' },
  { path: '/settings', name: 'Settings' }
];

// Shows where the router is, so clicking a tab visibly changes something
const CurrentPath = () => {
  const { pathname } = useLocation();
  return (
    <div className="example-stack">
      <TabsRouted tabs={tabs} />
      <p>Current path: {pathname}</p>
    </div>
  );
};

export default {
  name: 'TabsRouted',
  description: 'Tabs that are router links: each tab is a { path, name } pair and the tab matching the current location is marked active. The "/" tab only matches the root itself.',
  examples: [
    {
      name: 'Tabs',
      code: `<TabsRouted tabs={[
  { path: '/', name: 'Overview' },
  { path: '/reports', name: 'Reports' },
  { path: '/settings', name: 'Settings' }
]} />`,
      output: <TabsRouted tabs={tabs} />
    },
    {
      name: 'Following the router',
      code: `const { pathname } = useLocation();

<TabsRouted tabs={tabs} />
<p>Current path: {pathname}</p>`,
      output: <CurrentPath />
    },
    {
      name: 'Two tabs',
      code: `<TabsRouted tabs={[
  { path: '/', name: 'Profile' },
  { path: '/billing', name: 'Billing' }
]} />`,
      output: <TabsRouted tabs={[{ path: '/', name: 'Profile' }, { path: '/billing', name: 'Billing' }]} />
    }
  ]
};
