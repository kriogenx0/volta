import { useState } from 'react';

import TabBar from '../../components/TabBar/TabBar';

const tabs = ['Overview', 'Activity', 'Settings'];

const Controlled = () => {
  const [index, setIndex] = useState(1);
  return (
    <div className="example-stack">
      <TabBar tabs={tabs} selectedTabIndex={index} onChange={setIndex} />
      <p>Selected: {tabs[index]}</p>
    </div>
  );
};

const WithCallback = () => {
  const [last, setLast] = useState('nothing yet');
  return (
    <div className="example-stack">
      <TabBar tabs={tabs} onChange={(index, label) => setLast(`${label} (index ${index})`)} />
      <p>Last change: {last}</p>
    </div>
  );
};

export default {
  name: 'TabBar',
  description: 'A row of tabs that tracks which one is selected. Tabs are strings (or elements with a label prop); onChange receives the new index and label, and selectedTabIndex sets or moves the selection.',
  examples: [
    {
      name: 'Tabs',
      code: '<TabBar tabs={["Overview", "Activity", "Settings"]} />',
      output: <TabBar tabs={tabs} />
    },
    {
      name: 'Starting on another tab',
      code: '<TabBar tabs={["Overview", "Activity", "Settings"]} selectedTabIndex={2} />',
      output: <TabBar tabs={tabs} selectedTabIndex={2} />
    },
    {
      name: 'Controlled by state',
      code: `const [index, setIndex] = useState(1);

<TabBar tabs={tabs} selectedTabIndex={index} onChange={setIndex} />`,
      output: <Controlled />
    },
    {
      name: 'onChange callback',
      code: `<TabBar
  tabs={["Overview", "Activity", "Settings"]}
  onChange={(index, label) => setLast(\`\${label} (index \${index})\`)}
/>`,
      output: <WithCallback />
    }
  ]
};
