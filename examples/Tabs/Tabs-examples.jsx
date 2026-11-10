import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import Tabs from '../../components/Tabs/Tabs';

const TabsExample = () => {
  const [selectedKey, setSelectedKey] = useState(0);
  const tabs = ['Overview', 'Details', 'Activity', 'Settings'];
  return (
    <div>
      <Tabs tabs={tabs} selectedTabKey={selectedKey} onSelect={(key) => setSelectedKey(key)} />
      <div className="example-note">
        Showing: {tabs[selectedKey]}
      </div>
    </div>
  );
};

const TabsRightExample = () => {
  const [selectedKey, setSelectedKey] = useState(0);
  const tabs = ['All', 'Active', 'Archived'];
  return (
    <Tabs tabs={tabs} selectedTabKey={selectedKey} onSelect={(k) => setSelectedKey(k)} align="Right" />
  );
};

const INDEX_TABS = ['Overview', 'Activity', 'Settings'];

const IndexExample = () => {
  const [index, setIndex] = useState(1);
  return (
    <div className="example-stack">
      <Tabs tabs={INDEX_TABS} selectedTabIndex={index} onChange={setIndex} />
      <p className="example-note">Selected: {INDEX_TABS[index]}</p>
    </div>
  );
};

const CallbackExample = () => {
  const [last, setLast] = useState('nothing yet');
  return (
    <div className="example-stack">
      <Tabs tabs={INDEX_TABS} onChange={(index, label) => setLast(`${label} (index ${index})`)} />
      <p className="example-note">Last change: {last}</p>
    </div>
  );
};

const ROUTED_TABS = [
  { path: '/', name: 'Overview' },
  { path: '/reports', name: 'Reports' },
  { path: '/settings', name: 'Settings' }
];

// Shows where the router is, so clicking a tab visibly changes something
const RoutedExample = () => {
  const { pathname } = useLocation();
  return (
    <div className="example-stack">
      <Tabs tabs={ROUTED_TABS} />
      <p className="example-note">Current path: {pathname}</p>
    </div>
  );
};

export default {
  name: 'Tabs',
  description: 'A row of tabs for switching between panels, or between sections that each have a URL. Tabs are strings (or elements with a label prop), or { path, name } pairs that are router links and are selected while the route matches. Choose the selection with selectedTabKey (the parent decides) or selectedTabIndex (it also follows clicks), or let the first tab start selected. onSelect gets (key, tab) and onChange gets (index, label). TabBar and TabsRouted are other names for it.',
  examples: [
    {
      name: 'Tabs',
      code: `<Tabs
  tabs={['Overview', 'Details', 'Activity', 'Settings']}
  selectedTabKey={selectedKey}
  onSelect={(key) => setSelectedKey(key)}
/>`,
      output: <TabsExample />
    },
    {
      name: 'Right-aligned tabs',
      code: `<Tabs tabs={['All', 'Active', 'Archived']} selectedTabKey={0} align="Right" />`,
      output: <TabsRightExample />
    },
    {
      name: 'Selected by index, with onChange',
      code: `const [index, setIndex] = useState(1);

<Tabs tabs={['Overview', 'Activity', 'Settings']} selectedTabIndex={index} onChange={setIndex} />`,
      output: <IndexExample />
    },
    {
      name: 'Keeping its own selection',
      code: `<Tabs
  tabs={['Overview', 'Activity', 'Settings']}
  onChange={(index, label) => setLast(\`\${label} (index \${index})\`)}
/>`,
      output: <CallbackExample />
    },
    {
      name: 'Router links',
      code: `<Tabs tabs={[
  { path: '/', name: 'Overview' },
  { path: '/reports', name: 'Reports' },
  { path: '/settings', name: 'Settings' }
]} />`,
      output: <RoutedExample />
    }
  ]
};
