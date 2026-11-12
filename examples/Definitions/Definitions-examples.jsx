import Definitions from '../../components/Definitions/Definitions';

export default {
  name: 'Definitions',
  description: 'A definition list for displaying key-value metadata.',
  examples: [
    {
      name: 'Basic list',
      code: `<Definitions data={{
  Name: 'Alex Johnson',
  Role: 'Product Designer',
  Team: 'Platform',
  Location: 'Cupertino, CA',
}} />`,
      output: (
        <Definitions data={{
          Name: 'Alex Johnson',
          Role: 'Product Designer',
          Team: 'Platform',
          Location: 'Cupertino, CA',
        }} />
      )
    },
    {
      name: 'Technical metadata',
      code: `<Definitions data={{
  Version: '1.12.1',
  Build: '4502',
  Environment: 'Production',
  'Last Updated': '2026-05-19',
}} />`,
      output: (
        <Definitions data={{
          Version: '1.12.1',
          Build: '4502',
          Environment: 'Production',
          'Last Updated': '2026-05-19',
        }} />
      )
    },
  ]
};
