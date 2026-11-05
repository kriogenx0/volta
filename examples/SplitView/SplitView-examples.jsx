import { useState } from 'react';

import Button from '../../components/Button/Button';
import SplitView from '../../components/SplitView/SplitView';

import './SplitView-examples.scss';

const ITEMS = ['Inbox', 'Drafts', 'Sent', 'Archive', 'Trash', 'Spam', 'Starred', 'Important'];

const Side = () => (
  <div className="example-split_view_side">
    <h4>Folders</h4>
    <ul>
      {ITEMS.map((item) => <li key={item}>{item}</li>)}
    </ul>
  </div>
);

const Main = ({ lines = 2 }) => (
  <div className="example-split_view_pane">
    <h4>Main content</h4>
    {Array.from({ length: lines }, (_, i) => (
      <p key={i}>Line {i + 1} of the main pane.</p>
    ))}
  </div>
);

// The frame fixes the height, so setScrollHeight (which sizes the view to the
// window) is turned off.
const Frame = ({ children }) => <div className="example-split_view_frame">{children}</div>;

const Toggle = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="example-stack">
      <div>
        <Button onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'} side pane</Button>
      </div>
      <Frame>
        <SplitView open={open} side={<Side />} setScrollHeight={false}>
          <Main />
        </SplitView>
      </Frame>
    </div>
  );
};

export default {
  name: 'SplitView',
  description: 'A main pane beside a collapsible side pane. open reveals the side pane, and each pane scrolls on its own. By default the view is also sized to fill the window below its top edge; turn that off with setScrollHeight={false} when the parent sets the height.',
  examples: [
    {
      name: 'Toggle the side pane',
      code: `const [open, setOpen] = useState(true);

<Button onClick={() => setOpen(!open)}>Hide side pane</Button>
<SplitView open={open} side={<Folders />} setScrollHeight={false}>
  <MainContent />
</SplitView>`,
      output: <Toggle />
    },
    {
      name: 'Side pane closed',
      code: `<SplitView side={<Folders />} setScrollHeight={false}>
  <MainContent />
</SplitView>`,
      output: (
        <Frame>
          <SplitView side={<Side />} setScrollHeight={false}>
            <Main />
          </SplitView>
        </Frame>
      )
    },
    {
      name: 'Panes scroll independently',
      code: `<SplitView open side={<Folders />} setScrollHeight={false}>
  <LongContent />
</SplitView>`,
      output: (
        <Frame>
          <SplitView open side={<Side />} setScrollHeight={false}>
            <Main lines={30} />
          </SplitView>
        </Frame>
      )
    }
  ]
};
