import Empty from '../../components/Empty/Empty';

export default {
  name: 'Empty',
  description: 'A placeholder for empty states — zero data, no results, etc.',
  examples: [
    {
      name: 'Empty state',
      code: '<Empty>No results found.</Empty>',
      output: <Empty>No results found.</Empty>
    },
    {
      name: 'Empty state with action hint',
      code: '<Empty>No files uploaded yet. Drag and drop to get started.</Empty>',
      output: <Empty>No files uploaded yet. Drag and drop to get started.</Empty>
    },
  ]
};
