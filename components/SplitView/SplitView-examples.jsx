import { useState } from 'react';
import SplitView from './SplitView';

const SplitViewExample = () => (
  <div style={{ height: 200, border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
    <SplitView
      side={
        <div style={{ padding: 16 }}>
          <strong>Sidebar</strong>
          <ul style={{ margin: '8px 0', padding: '0 0 0 16px', fontSize: 13 }}>
            <li>Item A</li>
            <li>Item B</li>
            <li>Item C</li>
          </ul>
        </div>
      }
    >
      <div style={{ padding: 16 }}>
        <strong>Main content</strong>
        <p style={{ fontSize: 13 }}>Select an item from the sidebar.</p>
      </div>
    </SplitView>
  </div>
);

export default {
  name: 'SplitView',
  description: 'A two-column layout with a fixed sidebar and scrollable main area.',
  examples: [
    {
      name: 'SplitView',
      code: `<SplitView side={<Sidebar />}>
  <MainContent />
</SplitView>`,
      output: <SplitViewExample />
    },
  ]
};
