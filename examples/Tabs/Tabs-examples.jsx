import { useState } from 'react';
import Tabs from '../../components/Tabs/Tabs';

const TabsExample = () => {
  const [selectedKey, setSelectedKey] = useState(0);
  const tabs = ['Overview', 'Details', 'Activity', 'Settings'];
  return (
    <div>
      <Tabs tabs={tabs} selectedTabKey={selectedKey} onSelect={(key) => setSelectedKey(key)} />
      <div style={{ padding: '16px 0', fontSize: 13, color: '#666' }}>
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

export default {
  name: 'Tabs',
  description: 'A horizontal navigation bar for switching between content panels.',
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
  ]
};
