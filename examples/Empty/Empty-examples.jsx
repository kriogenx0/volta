import { useState } from 'react';

import Button from '../../components/Button/Button';
import Empty from '../../components/Empty/Empty';

const LoadingThenEmpty = () => {
  const [loading, setLoading] = useState(true);
  return (
    <div className="example-stack">
      <Empty loading={loading}>{loading ? 'Loading projects…' : 'No projects yet.'}</Empty>
      <div><Button onClick={() => setLoading(!loading)}>{loading ? 'Finish loading' : 'Load again'}</Button></div>
    </div>
  );
};

export default {
  name: 'Empty',
  description: 'A placeholder for empty states: zero data, no results, and so on. It is soft, muted text. icon puts a large drawn icon above the message (questionmark is a big question mark), and loading shows a Loader with the message as its caption, then the message itself when it stops.',
  examples: [
    {
      name: 'Empty state',
      code: '<Empty>No results found.</Empty>',
      output: <Empty>No results found.</Empty>
    },
    {
      name: 'With a big question mark',
      code: '<Empty icon="questionmark">We couldn\'t find that page.</Empty>',
      output: <Empty icon="questionmark">We couldn't find that page.</Empty>
    },
    {
      name: 'Loading',
      code: '<Empty loading>Loading projects…</Empty>',
      output: <Empty loading>Loading projects…</Empty>
    },
    {
      name: 'Loading, then empty',
      code: '<Empty loading={isLoading}>{isLoading ? \'Loading projects…\' : \'No projects yet.\'}</Empty>',
      output: <LoadingThenEmpty />
    },
    {
      name: 'Empty state with action hint',
      code: '<Empty>No files uploaded yet. Drag and drop to get started.</Empty>',
      output: <Empty>No files uploaded yet. Drag and drop to get started.</Empty>
    },
  ]
};
