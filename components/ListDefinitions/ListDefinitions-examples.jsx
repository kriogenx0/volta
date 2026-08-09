import ListDefinitions from './ListDefinitions';

export default {
  name: 'ListDefinitions',
  description: 'A definition list for displaying key-value metadata.',
  examples: [
    {
      name: 'Basic list',
      code: `<ListDefinitions data={{
  Name: 'Alex Johnson',
  Role: 'Product Designer',
  Team: 'Platform',
  Location: 'Cupertino, CA',
}} />`,
      output: (
        <ListDefinitions data={{
          Name: 'Alex Johnson',
          Role: 'Product Designer',
          Team: 'Platform',
          Location: 'Cupertino, CA',
        }} />
      )
    },
    {
      name: 'Technical metadata',
      code: `<ListDefinitions data={{
  Version: '1.12.1',
  Build: '4502',
  Environment: 'Production',
  'Last Updated': '2026-05-19',
}} />`,
      output: (
        <ListDefinitions data={{
          Version: '1.12.1',
          Build: '4502',
          Environment: 'Production',
          'Last Updated': '2026-05-19',
        }} />
      )
    },
  ]
};
